import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

type FormState = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

const INITIAL: FormState = { name: "", email: "", company: "", subject: "", message: "" };

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+1 (925) 580-8156" },
  { icon: Mail, label: "Email", value: "info@assurelogisticsservices.com" },
  { icon: MapPin, label: "Address", value: "4164 Powell Way Unit 101, Corona, CA 92883" },
];

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setError("Email service is not configured yet. Please call us directly at +1 (925) 580-8156.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, PUBLIC_KEY);
      setSent(true);
      setForm(INITIAL);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
            Get in Touch
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Request a Quote or Inquiry
          </h2>
          <p className="mt-3 text-muted-foreground">
            Fill out the form and our logistics team will reach out with a tailored quote and
            information about our services within one business day.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-6">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-amber-200">
                  <Icon className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
                </div>
              </div>
            ))}

            <div className="rounded-xl border bg-muted/40 p-5 mt-4">
              <p className="text-sm font-semibold text-foreground">Assure Tour LLC</p>
              <p className="text-xs text-muted-foreground mt-1">DBA Assure Logistics Services</p>
              <p className="text-xs text-muted-foreground mt-1">Pawan Sobti — Sole Member</p>
              <div className="mt-3 border-t pt-3 space-y-1 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Hours of Operation</p>
                <p>Mon – Fri: 7:00 AM – 7:00 PM PST</p>
                <p>Sat: 8:00 AM – 3:00 PM PST</p>
                <p>Sun: Closed (emergency line available)</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {sent ? (
              <div className="flex flex-col items-center justify-center rounded-xl border bg-green-50 border-green-200 p-12 text-center h-full">
                <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-green-800">Message Received!</h3>
                <p className="mt-2 text-sm text-green-700">
                  Thanks for reaching out. A confirmation has been sent to your email
                  and our team will follow up within one business day.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm font-medium text-green-700 underline underline-offset-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input name="from_name" placeholder="Jane Doe" value={form.name} onChange={update("name")} required data-testid="input-contact-name" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <Input name="from_email" type="email" placeholder="jane@company.com" value={form.email} onChange={update("email")} required data-testid="input-contact-email" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">Company</label>
                    <Input name="company" placeholder="Acme Inc." value={form.company} onChange={update("company")} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">Subject</label>
                    <Input name="subject" placeholder="FTL quote – Chicago to Miami" value={form.subject} onChange={update("subject")} />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="message"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[120px] resize-y"
                    placeholder="Tell us about your freight needs — weight, dimensions, origin, destination, timeline…"
                    value={form.message}
                    onChange={update("message")}
                    required
                    data-testid="textarea-contact-message"
                  />
                </div>

                {error && (
                  <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
                )}

                <Button type="submit" disabled={loading} className="w-full" data-testid="button-contact-submit">
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Sending…" : "Send Inquiry"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You'll receive a confirmation email. We respond within one business day.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
