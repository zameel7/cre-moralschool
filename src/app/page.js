"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const DISTRICTS_API = process.env.NEXT_PUBLIC_DISTRICTS_API || "https://guideportal.wisdomislam.org/api/get-from-guide/wisdom_districts";
const ZONES_API = process.env.NEXT_PUBLIC_ZONES_API || "https://guideportal.wisdomislam.org/api/get-from-guide/zones?district_type=wisdom&district_id=";
const SUBMIT_API = process.env.NEXT_PUBLIC_SUBMIT_API || "https://guideportal.wisdomislam.org/api/p/cre-registration";

const HERO_PLACEHOLDER = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

export default function HomePage() {
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState({
    district: "",
    zone: "",
    name: "",
    sex: "",
    age: "",
    phone_number: "",
    parents_number: "",
    place: "",
    class: "",
    school: "",
    district_other: "",
    zone_other: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(DISTRICTS_API)
      .then((res) => res.json())
      .then((data) => setDistricts((data.data && data.data.list) ? data.data.list : []));
  }, []);

  useEffect(() => {
    if (form.district && form.district !== 'other') {
      fetch(ZONES_API + form.district)
        .then((res) => res.json())
        .then((data) => setZones((data.data && data.data.list) ? data.data.list : []));
    } else {
      setZones([]);
      // If district is 'other', set zone to 'other' (0)
      if (form.district === 'other') {
        setForm((prev) => ({ ...prev, zone: 'other' }));
      } else {
        setForm((prev) => ({ ...prev, zone: '' }));
      }
    }
  }, [form.district]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    // Validation for required fields (in case browser doesn't catch)
    if (!form.name || !form.sex || !form.age || !form.phone_number || !form.parents_number || !form.place || !form.class || !form.school || !form.district || (form.district === 'other' && !form.district_other) || ((form.zone === '' || !form.zone) && form.district !== 'other') || ((form.zone === 'other' || form.district === 'other') && !form.zone_other)) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }
    try {
      const district_id = form.district === 'other' ? 0 : (form.district ? Number(form.district) : null);
      const zone_id = (form.zone === 'other' || form.district === 'other') ? 0 : (form.zone ? Number(form.zone) : null);
      const res = await fetch(SUBMIT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          sex: form.sex.toLowerCase(),
          age: Number(form.age),
          phone_number: form.phone_number,
          parents_number: form.parents_number,
          place: form.place,
          class: form.class,
          school: form.school,
          district_id,
          zone_id,
          district_other: form.district === 'other' ? form.district_other : '',
          zone_other: (form.zone === 'other' || form.district === 'other') ? form.zone_other : '',
        }),
      });
      if (!res.ok) throw new Error("Registration failed");
      setSuccess(true);
      setForm({
        district: "",
        zone: "",
        name: "",
        sex: "",
        age: "",
        phone_number: "",
        parents_number: "",
        place: "",
        class: "",
        school: "",
        district_other: "",
        zone_other: "",
      });
      toast.success('Registration successful! Thank you for registering.');
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur shadow-md border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:py-4 rounded-b-xl relative">
          {/* CRE Logo Left */}
          <div className="flex items-center gap-2 min-w-[56px]">
            <Image
              src="/logo/light.png"
              alt="CRE Logo"
              width={56}
              height={56}
              className="block dark:hidden"
              priority
            />
            <Image
              src="/logo/dark.png"
              alt="CRE Logo Dark"
              width={56}
              height={56}
              className="hidden dark:block"
              priority
            />
          </div>
          {/* Centered Nav */}
          <div className="flex-1 flex justify-center">
            <div className="flex gap-2 md:gap-4 text-base font-medium bg-white/70 dark:bg-zinc-900/70 rounded-full px-4 py-1 shadow-sm">
              <a href="#home" className="px-3 py-1.5 rounded-full transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/20 focus:text-primary">Home</a>
              <a href="#about" className="px-3 py-1.5 rounded-full transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/20 focus:text-primary">About</a>
              <a href="#register" className="px-3 py-1.5 rounded-full transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/20 focus:text-primary">Register</a>
            </div>
          </div>
          {/* Summerise Logo Right */}
          <div className="flex items-center gap-2 min-w-[56px] justify-end">
            <Image
              src="/logo/summerise-light.png"
              alt="Summerise Logo"
              width={56}
              height={56}
              className="block dark:hidden"
              priority
            />
            <Image
              src="/logo/summerise-dark.png"
              alt="Summerise Logo Dark"
              width={56}
              height={56}
              className="hidden dark:block"
              priority
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative flex flex-col items-center justify-center w-full min-h-screen pt-20 pb-8">
        <Image
          src={HERO_PLACEHOLDER}
          alt="Hero Background"
          fill
          className="object-cover object-center absolute inset-0 w-full h-full z-0"
          style={{ filter: 'brightness(0.7)' }}
          priority
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4">
          <Image
            src="/logo/dark.png"
            alt="CRE Logo"
            width={200}
            height={200}
            className="block dark:hidden mb-4"
          />
          <p className="text-lg md:text-2xl text-white/90 max-w-xl mx-auto drop-shadow malayalam text-center font-bold">
            പതിറ്റാണ്ടുകളായി വിദ്യാർത്ഥി തലമുറയിൽ ധാർമിക വിപ്ലവം സൃഷ്ടിച്ചു കൊണ്ടിരിക്കുന്ന വൈജ്ഞാനിക ഗോപുരം... CRE..
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full flex justify-center py-12 px-4 bg-gradient-to-b from-primary/5 to-white dark:from-zinc-900/60 dark:to-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 flex flex-col items-start">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-primary text-left">About</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-left">
              <span className="block mb-2">CRE, Continuing Religious Education, is a transformative educational movement, inspiring generations of students with moral and intellectual values.</span>
              <span className="block mb-2">Our mission is to nurture a generation of students who are not only academically excellent but also morally upright and socially responsible.</span>
              <span className="block">Join us for a unique learning experience that blends tradition with modernity.</span>
            </p>
          </div>
          <div className="flex flex-row gap-4 items-center flex-1 justify-center">
            <Image
              src="/logo/light.png"
              alt="CRE Logo"
              width={140}
              height={140}
              className=""
            />
            <Image
              src="/logo/summerise-light.png"
              alt="Summerise Logo"
              width={140}
              height={140}
              className=""
            />
          </div>
        </div>
      </section>

      {/* Register Section */}
      <section id="register" className="w-full flex flex-col items-center py-12 px-4 flex-1 bg-gradient-to-b from-white to-primary/5 dark:from-zinc-900 dark:to-zinc-900">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary">Register Now</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-transparent p-0" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label>District</Label>
              <Select value={form.district} onValueChange={(v) => handleChange('district', v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.district === 'other' && (
                <Input className="mt-2" placeholder="Other District (if not listed)" value={form.district_other} onChange={e => handleChange('district_other', e.target.value)} required />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Area</Label>
              <Select value={form.zone} onValueChange={(v) => handleChange('zone', v)} disabled={!form.district || form.district === 'other'} required={form.district !== 'other'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((z) => (
                    <SelectItem key={z.id} value={String(z.id)}>{z.name}</SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {(form.zone === 'other' || form.district === 'other') && (
                <Input className="mt-2" placeholder="Other Area (if not listed)" value={form.zone_other} onChange={e => handleChange('zone_other', e.target.value)} required />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={e => handleChange('name', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Sex</Label>
              <Select value={form.sex} onValueChange={(v) => handleChange('sex', v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Age</Label>
              <Input type="number" min="1" value={form.age} onChange={e => handleChange('age', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Phone Number</Label>
              <Input type="tel" value={form.phone_number} onChange={e => handleChange('phone_number', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Parents Number</Label>
              <Input type="tel" value={form.parents_number} onChange={e => handleChange('parents_number', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Place</Label>
              <Input value={form.place} onChange={e => handleChange('place', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label>Class / Course</Label>
              <Input value={form.class} onChange={e => handleChange('class', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label>School / Campus</Label>
              <Input value={form.school} onChange={e => handleChange('school', e.target.value)} required />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? 'Submitting...' : 'Register'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 py-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo/summerise-light.png"
              alt="CRE Moral School Logo"
              width={32}
              height={32}
              className="block dark:hidden"
            />
            <Image
              src="/logo/summerise-dark.png"
              alt="CRE Moral School Logo Dark"
              width={32}
              height={32}
              className="hidden dark:block"
            />
            <Image
              src="/logo/light.png"
              alt="CRE Logo"
              width={32}
              height={32}
              className="block dark:hidden"
            />
            <Image
              src="/logo/dark.png"
              alt="CRE Logo Dark"
              width={32}
              height={32}
              className="hidden dark:block"
            />
          </div>
          <div className="text-sm text-muted-foreground">© 2025 CRE | Continuing Religious Education. All rights reserved.</div>
          <div className="text-sm text-muted-foreground flex items-center gap-3">
            Contact: <span className="font-medium">wisdomstudents@gmail.com</span>
            <a href="https://www.instagram.com/wisdomstudents/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
    <path d="M 8 3 C 5.239 3 3 5.239 3 8 L 3 16 C 3 18.761 5.239 21 8 21 L 16 21 C 18.761 21 21 18.761 21 16 L 21 8 C 21 5.239 18.761 3 16 3 L 8 3 z M 18 5 C 18.552 5 19 5.448 19 6 C 19 6.552 18.552 7 18 7 C 17.448 7 17 6.552 17 6 C 17 5.448 17.448 5 18 5 z M 12 7 C 14.761 7 17 9.239 17 12 C 17 14.761 14.761 17 12 17 C 9.239 17 7 14.761 7 12 C 7 9.239 9.239 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z"></path>
</svg>
            </a>
            <a href="https://www.facebook.com/wisdomstudents" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
    <path d="M12,2C6.477,2,2,6.477,2,12c0,5.013,3.693,9.153,8.505,9.876V14.65H8.031v-2.629h2.474v-1.749 c0-2.896,1.411-4.167,3.818-4.167c1.153,0,1.762,0.085,2.051,0.124v2.294h-1.642c-1.022,0-1.379,0.969-1.379,2.061v1.437h2.995 l-0.406,2.629h-2.588v7.247C18.235,21.236,22,17.062,22,12C22,6.477,17.523,2,12,2z"></path>
</svg>
            </a>
            <a href="https://api.whatsapp.com/send/?phone=%2B918547256709&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
    <path d="M19.077,4.928C17.191,3.041,14.683,2.001,12.011,2c-5.506,0-9.987,4.479-9.989,9.985 c-0.001,1.76,0.459,3.478,1.333,4.992L2,22l5.233-1.237c1.459,0.796,3.101,1.215,4.773,1.216h0.004 c5.505,0,9.986-4.48,9.989-9.985C22.001,9.325,20.963,6.816,19.077,4.928z M16.898,15.554c-0.208,0.583-1.227,1.145-1.685,1.186 c-0.458,0.042-0.887,0.207-2.995-0.624c-2.537-1-4.139-3.601-4.263-3.767c-0.125-0.167-1.019-1.353-1.019-2.581 S7.581,7.936,7.81,7.687c0.229-0.25,0.499-0.312,0.666-0.312c0.166,0,0.333,0,0.478,0.006c0.178,0.007,0.375,0.016,0.562,0.431 c0.222,0.494,0.707,1.728,0.769,1.853s0.104,0.271,0.021,0.437s-0.125,0.27-0.249,0.416c-0.125,0.146-0.262,0.325-0.374,0.437 c-0.125,0.124-0.255,0.26-0.11,0.509c0.146,0.25,0.646,1.067,1.388,1.728c0.954,0.85,1.757,1.113,2.007,1.239 c0.25,0.125,0.395,0.104,0.541-0.063c0.146-0.166,0.624-0.728,0.79-0.978s0.333-0.208,0.562-0.125s1.456,0.687,1.705,0.812 c0.25,0.125,0.416,0.187,0.478,0.291C17.106,14.471,17.106,14.971,16.898,15.554z"></path>
</svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
} 