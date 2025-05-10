"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const DISTRICTS_API = "https://guideportal.wisdomislam.org/api/get-from-guide/wisdom_districts";
const ZONES_API = "https://guideportal.wisdomislam.org/api/get-from-guide/zones?district_type=wisdom&district_id=";
const SUBMIT_API = "https://guideportal.wisdomislam.org/api/create-from-guide/moral-school-registration";

export default function HomePage() {
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState({
    district: "",
    zone: "",
    name: "",
    sex: "",
    age: "",
    phone: "",
    parentPhone: "",
    place: "",
    class: "",
    school: "",
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
    if (form.district) {
      fetch(ZONES_API + form.district)
        .then((res) => res.json())
        .then((data) => setZones((data.data && data.data.list) ? data.data.list : []));
    } else {
      setZones([]);
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
    try {
      const res = await fetch(SUBMIT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district: form.district,
          zone: form.zone,
          name: form.name,
          sex: form.sex,
          age: form.age,
          phone: form.phone,
          parent_phone: form.parentPhone,
          place: form.place,
          class: form.class,
          school: form.school,
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
        phone: "",
        parentPhone: "",
        place: "",
        class: "",
        school: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e0e7ef] dark:from-zinc-900 dark:to-zinc-950 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-zinc-900 shadow-sm">
        <Image
          src="/logo/summerise-light.png"
          alt="CRE Moral School Logo"
          width={100}
          height={100}
          className="mx-auto mb-4 block dark:hidden"
          priority
        />
        <Image
          src="/logo/summerise-dark.png"
          alt="CRE Moral School Logo Dark"
          width={100}
          height={100}
          className="mx-auto mb-4 hidden dark:block"
          priority
        />
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">CRE | Moral School</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
          പതിറ്റാണ്ടുകളായി വിദ്യാർത്ഥി തലമുറയിൽ ധാർമിക വിപ്ലവം സൃഷ്ടിച്ചു കൊണ്ടിരിക്കുന്ന വൈജ്ഞാനിക ഗോപുരം... CRE..
        </p>
      </section>

      {/* About Section */}
      <section className="w-full flex justify-center py-8 px-4">
        <div className="max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold mb-2 text-primary">About CRE | Moral School</h2>
          <p className="text-base text-muted-foreground">
            CRE Moral School is a transformative educational movement, inspiring generations of students with moral and intellectual values. Our mission is to nurture a generation of students who are not only academically excellent but also morally upright and socially responsible. Join us for a unique learning experience that blends tradition with modernity.
          </p>
        </div>
      </section>

      {/* Register Section */}
      <section id="register" className="w-full flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 flex flex-col gap-6 border border-zinc-100 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-center mb-2 text-primary">Register Now</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>District</Label>
                <Select value={form.district} onValueChange={(v) => handleChange("district", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Area</Label>
                <Select value={form.zone} onValueChange={(v) => handleChange("zone", v)} disabled={!form.district}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((z) => (
                      <SelectItem key={z.id} value={String(z.id)}>{z.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={e => handleChange("name", e.target.value)} required />
              </div>
              <div>
                <Label>Sex</Label>
                <Select value={form.sex} onValueChange={(v) => handleChange("sex", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Age</Label>
                <Input type="number" min="1" value={form.age} onChange={e => handleChange("age", e.target.value)} required />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} required />
              </div>
              <div>
                <Label>Parents Number</Label>
                <Input type="tel" value={form.parentPhone} onChange={e => handleChange("parentPhone", e.target.value)} required />
              </div>
              <div>
                <Label>Place</Label>
                <Input value={form.place} onChange={e => handleChange("place", e.target.value)} required />
              </div>
              <div>
                <Label>Class / Course</Label>
                <Input value={form.class} onChange={e => handleChange("class", e.target.value)} required />
              </div>
              <div>
                <Label>School / Campus</Label>
                <Input value={form.school} onChange={e => handleChange("school", e.target.value)} required />
              </div>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">Registration successful!</div>}
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Submitting..." : "Register"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
} 