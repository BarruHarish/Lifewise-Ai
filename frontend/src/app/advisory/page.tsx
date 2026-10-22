"use client";

import { useState, useEffect } from "react";
import { 
  CalendarCheck, 
  Video, 
  Phone, 
  Star, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  UserCheck, 
  ShieldCheck,
  Send,
  Sparkles,
  Bot
} from "lucide-react";
import confetti from "canvas-confetti";
import { AdvisorProfile, AppointmentRecord } from "@/types";

export default function AdvisoryPage() {
  const [advisors, setAdvisors] = useState<AdvisorProfile[]>([]);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<number>(1);
  const [consultationType, setConsultationType] = useState<"video" | "phone">("video");
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-25");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("11:00 AM - 11:45 AM");

  const [customerName, setCustomerName] = useState<string>("Rohan Mehra");
  const [customerEmail, setCustomerEmail] = useState<string>("rohan.mehra@example.com");
  const [customerPhone, setCustomerPhone] = useState<string>("+91 98765 43210");
  const [notes, setNotes] = useState<string>("Reviewing term insurance coverage for home loan safety.");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentRecord | null>(null);

  // Chat assistant state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Hello! I am LifeWise Assistant, an automated educational assistant. I can answer questions about basic insurance terminology, claim ratios, and the Net Needs calculation. (Note: I am not a licensed advisor)."
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  const timeSlots = [
    "09:30 AM - 10:15 AM",
    "11:00 AM - 11:45 AM",
    "02:00 PM - 02:45 PM",
    "03:30 PM - 04:15 PM",
    "05:00 PM - 05:45 PM",
  ];

  useEffect(() => {
    fetch("http://localhost:8000/api/advisors")
      .then((res) => res.json())
      .then((data: AdvisorProfile[]) => {
        if (data && data.length > 0) {
          setAdvisors(data);
          setSelectedAdvisorId(data[0].id);
        }
      })
      .catch(() => {
        // Fallback demo advisors
        const sample: AdvisorProfile[] = [
          {
            id: 1,
            name: "Priya Sharma",
            title: "Senior Protection Specialist & CFP®",
            experience_years: 11,
            certifications: "CFP, IRDAI Lic. #ADV-88349",
            specialization: "Term Life & Family Income Protection",
            rating: 4.95,
            reviews_count: 214,
            languages: "English, Hindi",
            bio: "Specializing in pure term cover optimization for young families and salaried professionals.",
            avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
          },
          {
            id: 2,
            name: "Rajesh Verma",
            title: "Principal Wealth & Estate Planner",
            experience_years: 15,
            certifications: "Chartered Financial Analyst, IRDAI Lic. #ADV-49210",
            specialization: "Whole Life, Debt Shielding & Estate Planning",
            rating: 4.91,
            reviews_count: 189,
            languages: "English, Hindi, Marathi",
            bio: "Expert in liability risk mitigation, home loan protection, and long-term estate preservation.",
            avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
          },
          {
            id: 3,
            name: "Ananya Iyer",
            title: "Digital Advisory Consultant",
            experience_years: 8,
            certifications: "Associate Financial Planner, IRDAI Lic. #ADV-71932",
            specialization: "Goal-Based Savings & Education Planning",
            rating: 4.88,
            reviews_count: 132,
            languages: "English, Tamil, Hindi",
            bio: "Passionate about helping first-time insurance buyers make transparent, mathematically sound decisions.",
            avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
          }
        ];
        setAdvisors(sample);
      });
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      advisor_id: selectedAdvisorId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      consultation_type: consultationType,
      appointment_date: selectedDate,
      time_slot: selectedTimeSlot,
      notes: notes
    };

    try {
      const res = await fetch("http://localhost:8000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setConfirmedBooking(data);
      } else {
        throw new Error("Backend booking failed");
      }
    } catch {
      // Local fallback booking
      const chosen = advisors.find(a => a.id === selectedAdvisorId);
      const fallbackBooking: AppointmentRecord = {
        id: Math.floor(1000 + Math.random() * 9000),
        advisor_id: selectedAdvisorId,
        advisor_name: chosen?.name || "Senior Advisor",
        customer_name: customerName,
        customer_email: customerEmail,
        consultation_type: consultationType,
        appointment_date: selectedDate,
        time_slot: selectedTimeSlot,
        status: "confirmed",
        created_at: new Date().toISOString(),
        meeting_link: `https://meet.lifewise.ai/session/demo-${consultationType}`
      };
      setConfirmedBooking(fallbackBooking);
    } finally {
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {
        // canvas-confetti graceful fallback
      }
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    // Predefined reviewed FAQ answers
    setTimeout(() => {
      let botResponse = "LifeWise AI calculates your coverage using the Net Needs formula. For personalized underwriting details, schedule a call above.";
      const lower = userText.toLowerCase();

      if (lower.includes("claim") || lower.includes("csr")) {
        botResponse = "Individual Claim Settlement Ratio (CSR) indicates the percentage of claims paid by an insurer out of total claims received in a financial year. IRDAI recommends checking CSR consistency over 3-5 consecutive years.";
      } else if (lower.includes("term") || lower.includes("pure")) {
        botResponse = "Term insurance provides pure financial protection with zero maturity savings, making it the most cost-effective tool for large sums assured like ₹1 Crore or more.";
      } else if (lower.includes("tax") || lower.includes("80c")) {
        botResponse = "Under Section 80C, life insurance premiums up to ₹1.5 Lakhs per year are tax-deductible under the old regime. Death benefits paid to nominees are 100% tax-free under Section 10(10D).";
      } else if (lower.includes("inflation") || lower.includes("pv")) {
        botResponse = "We assume a 6% annual inflation rate on living expenses and a 7.5% discount yield on the investment corpus. This yields a net real discount factor of ~1.4% p.a.";
      } else if (lower.includes("rider")) {
        botResponse = "Common riders include Critical Illness (payout upon diagnosis of specified illnesses like cancer or heart attack) and Accidental Permanent Disability riders.";
      }

      setChatMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 400);
  };

  const selectedAdvisor = advisors.find((a) => a.id === selectedAdvisorId) || advisors[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <span className="badge-teal mb-2">Simulated Digital Advisory</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
            Certified Advisor Consultation
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Schedule a complimentary 45-minute digital session with an IRDAI-certified protection specialist to review your assessment findings.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          No High-Pressure Sales Guaranteed
        </div>
      </div>

      {/* Confirmation Modal / Card */}
      {confirmedBooking && (
        <div className="card-subtle p-8 bg-emerald-50/60 border border-emerald-200 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="badge-teal text-[11px]">Appointment Confirmed</span>
                  <h2 className="text-2xl font-extrabold text-slate-950 mt-1">
                    Consultation Booked Successfully!
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">ID: #{confirmedBooking.id}</span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                Thank you, <strong>{confirmedBooking.customer_name}</strong>. Your {confirmedBooking.consultation_type === "video" ? "Video Consultation" : "Phone Call"} with <strong>{confirmedBooking.advisor_name}</strong> is scheduled for <strong>{confirmedBooking.appointment_date}</strong> at <strong>{confirmedBooking.time_slot}</strong>.
              </p>

              <div className="p-4 rounded-xl bg-white border border-emerald-100 text-xs space-y-1 text-slate-600">
                <p><strong>Confirmation sent to:</strong> {confirmedBooking.customer_email}</p>
                {confirmedBooking.meeting_link && (
                  <p>
                    <strong>Meeting URL (Demo):</strong>{" "}
                    <a href={confirmedBooking.meeting_link} target="_blank" rel="noreferrer" className="text-teal-700 font-bold underline">
                      {confirmedBooking.meeting_link}
                    </a>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setConfirmedBooking(null)}
                className="btn-secondary text-xs py-2 px-4 mt-2"
              >
                Book Another Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form & Advisor Selection */}
      {!confirmedBooking && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Advisor Selection Column */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-600" />
              1. Select a Protection Specialist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {advisors.map((adv) => (
                <div
                  key={adv.id}
                  onClick={() => setSelectedAdvisorId(adv.id)}
                  className={`card-subtle p-5 bg-white border cursor-pointer transition flex flex-col justify-between ${
                    selectedAdvisorId === adv.id
                      ? "border-teal-600 shadow-md ring-2 ring-teal-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        {adv.avatar_url ? (
                          <img src={adv.avatar_url} alt={adv.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                            {adv.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{adv.name}</h4>
                        <p className="text-[11px] text-teal-700 font-semibold">{adv.specialization}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {adv.bio}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-600">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {adv.rating} ({adv.reviews_count})
                    </span>
                    <span>{adv.experience_years}+ yrs exp</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Time & Consultation Format */}
            <div className="card-subtle p-6 bg-white space-y-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                2. Choose Consultation Format & Slot
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setConsultationType("video")}
                  className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
                    consultationType === "video"
                      ? "border-teal-600 bg-teal-50/50 text-slate-900 font-semibold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Video className="w-5 h-5 text-teal-600" />
                  <div>
                    <div className="text-sm">Video Call</div>
                    <div className="text-[11px] text-slate-400 font-normal">Google Meet / Zoom</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType("phone")}
                  className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
                    consultationType === "phone"
                      ? "border-teal-600 bg-teal-50/50 text-slate-900 font-semibold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Phone className="w-5 h-5 text-teal-600" />
                  <div>
                    <div className="text-sm">Phone Call</div>
                    <div className="text-[11px] text-slate-400 font-normal">Direct mobile audio</div>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-fintech"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Available Time Slot
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="input-fintech"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Form & Instant Confirmation */}
          <div className="lg:col-span-5 card-subtle p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">
              3. Your Contact Details
            </h3>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-fintech"
                  placeholder="e.g. Rohan Mehra"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address (for calendar invite)
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="input-fintech"
                  placeholder="rohan@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="input-fintech"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Discussion Focus / Questions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-fintech text-xs"
                  placeholder="e.g. Home loan protection, critical illness riders, term plan comparison"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-teal w-full py-3 text-sm font-bold shadow-md"
                  id="advisory-btn-submit"
                >
                  {isSubmitting ? "Confirming Slot..." : "Confirm Free Advisory Booking"}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Demo consultation. No actual advisor sales call will be made without your consent.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Predefined FAQ Chat Assistant */}
      <div className="card-subtle p-6 bg-white border border-slate-200 mt-12">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">LifeWise FAQ Assistant</h3>
            <p className="text-xs text-slate-500">
              Ask about insurance terms, claim settlement ratios, tax sections (80C/10(10D)), and Net Needs math.
            </p>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="p-4 space-y-3 max-h-64 overflow-y-auto bg-slate-50/70 rounded-xl my-4 text-xs">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-xl leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-slate-900 text-white rounded-br-none"
                    : "bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-xs"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSendChat} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="e.g. What is claim settlement ratio? Or tell me about Section 80C..."
            className="input-fintech text-xs flex-1"
          />
          <button
            type="submit"
            className="btn-primary text-xs py-2 px-4 shadow-sm"
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
