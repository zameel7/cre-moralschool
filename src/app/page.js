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

export default function RegistrationPage() {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo/summerise-light.png"
            alt="CRE Moral School Logo"
            width={120}
            height={120}
            className="block dark:hidden"
            priority
          />
          <Image
            src="/logo/summerise-dark.png"
            alt="CRE Moral School Logo Dark"
            width={120}
            height={120}
            className="hidden dark:block"
            priority
          />
          <h1 className="text-2xl font-bold text-center mt-2">CRE | Moral School Registration</h1>
          <p className="text-center text-sm text-muted-foreground">
            പതിറ്റാണ്ടുകളായി വിദ്യാർത്ഥി തലമുറയിൽ ധാർമിക വിപ്ലവം സൃഷ്ടിച്ചു കൊണ്ടിരിക്കുന്ന വൈജ്ഞാനിക ഗോപുരം... CRE..
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">Registration successful!</div>}
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Submitting..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
} 