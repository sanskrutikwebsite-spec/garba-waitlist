"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, ExternalLink, Search, Filter, Hand, X, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

type Registration = {
  id: number;
  name: string;
  email: string;
  phone: string;
  passes: string;
  screenshot: string;
  status: string;
  ticketId: string;
  date: string;
  claimedBy: string;
  qrData?: string;
};

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [qrModalData, setQrModalData] = useState<{name: string, data: string, phone: string, passes: string, ticketId?: string} | null>(null);
  
  // Create Pass State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({ name: "", email: "", phone: "", passes: "1" });
  const [isCreating, setIsCreating] = useState(false);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Quick password protection for the demo
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [adminName, setAdminName] = useState("");

  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      if (data.registrations) {
        setRegistrations(data.registrations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminName.trim().length === 0) {
      alert("Please enter your name.");
      return;
    }
    
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin", password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        alert("Incorrect Password");
      }
    } catch (error) {
      alert("Error logging in");
    }
  };

  const handleClaim = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowId: id, adminName })
      });
      if (res.ok) {
        await fetchRegistrations();
      } else {
        alert("Failed to claim");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleApprove = async (id: number, userName: string, phone: string, passes: string) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowId: id })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchRegistrations();
        if (data.qrData) {
          setQrModalData({ name: userName, data: data.qrData, phone: phone, passes: passes, ticketId: data.ticketId });
        }
      } else {
        alert("Failed to approve");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRevoke = async (id: number) => {
    if (!confirm("Are you sure you want to revoke this approval? This will invalidate the QR code.")) return;
    setProcessingId(id);
    try {
      const res = await fetch("/api/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowId: id })
      });
      if (res.ok) {
        await fetchRegistrations();
      } else {
        alert("Failed to revoke");
      }
    } catch (err) {
      console.error(err);
      alert("Error revoking pass");
    } finally {
      setProcessingId(null);
    }
  };

  const handleResendEmail = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowId: id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Email successfully resent!");
      } else {
        alert(data.error || "Failed to resend email");
      }
    } catch (err) {
      console.error(err);
      alert("Error resending email");
    } finally {
      setProcessingId(null);
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_${qrModalData?.name.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch("/api/admin/create-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...createFormData, adminName })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchRegistrations();
        setShowCreateModal(false);
        setCreateFormData({ name: "", email: "", phone: "", passes: "1" });
        if (data.qrData) {
          setQrModalData({ name: createFormData.name, data: data.qrData, phone: createFormData.phone, passes: createFormData.passes, ticketId: data.ticketId });
        }
      } else {
        alert("Failed to create pass");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating pass");
    } finally {
      setIsCreating(false);
    }
  };

  // Stats Calculation
  const totalPurchases = registrations.length;
  const approvedPurchases = registrations.filter(r => r.status === 'Approved');
  
  const totalPassesGenerated = approvedPurchases.reduce((acc, curr) => acc + (parseInt(curr.passes) || 0), 0);
  
  const offlinePurchases = registrations.filter(r => r.screenshot === 'Offline Payment');
  const onlinePurchases = registrations.filter(r => r.screenshot !== 'Offline Payment');
  
  const offlinePassesCount = offlinePurchases.filter(r => r.status === 'Approved').reduce((acc, curr) => acc + (parseInt(curr.passes) || 0), 0);
  const onlinePassesCount = onlinePurchases.filter(r => r.status === 'Approved').reduce((acc, curr) => acc + (parseInt(curr.passes) || 0), 0);

  // Filter Logic
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          reg.phone?.includes(searchQuery);
    const matchesStatus = statusFilter === "All" || reg.status === statusFilter || (!reg.status && statusFilter === "Pending");
    const isOffline = reg.screenshot === 'Offline Payment';
    const matchesType = typeFilter === "All" || (typeFilter === "Offline" && isOffline) || (typeFilter === "Online" && !isOffline);
    return matchesSearch && matchesStatus && matchesType;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf5] p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 border border-foreground/10 flex flex-col gap-6 shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-brand-primary text-center">Team Login</h2>
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            placeholder="Your Name (e.g., Rahul)"
            className="w-full border-b border-foreground/30 py-4 text-foreground text-lg focus:outline-none focus:border-[#E3C57F] transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            className="w-full border-b border-foreground/30 py-4 text-foreground text-lg focus:outline-none focus:border-[#E3C57F] transition-colors"
          />
          <button type="submit" className="bg-foreground text-white py-4 px-6 font-bold uppercase tracking-widest hover:bg-brand-primary transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf5] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Dashboard <span className="text-brand-primary italic font-medium">Registrations</span>
            </h1>
            <p className="text-foreground/70 font-medium">Logged in as: <span className="text-brand-primary">{adminName}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowCreateModal(true)} className="bg-brand-primary text-white px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-brand-primary/90 transition-colors hidden sm:block">
              + Create Offline Pass
            </button>
            <button onClick={() => setShowCreateModal(true)} className="bg-brand-primary text-white p-2 text-sm font-bold uppercase tracking-wider hover:bg-brand-primary/90 transition-colors sm:hidden">
              +
            </button>
            <button onClick={fetchRegistrations} className="text-sm font-bold uppercase tracking-widest text-brand-primary hover:text-foreground transition-colors flex items-center gap-2">
              Refresh Data
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 border border-foreground/10 shadow-sm flex flex-col items-center text-center">
            <span className="text-sm font-bold uppercase text-foreground/50 tracking-widest">Total Orders</span>
            <span className="text-3xl font-black text-brand-primary">{totalPurchases}</span>
          </div>
          <div className="bg-white p-4 border border-foreground/10 shadow-sm flex flex-col items-center text-center">
            <span className="text-sm font-bold uppercase text-foreground/50 tracking-widest">Passes Generated</span>
            <span className="text-3xl font-black text-brand-primary">{totalPassesGenerated}</span>
          </div>
          <div className="bg-white p-4 border border-foreground/10 shadow-sm flex flex-col items-center text-center">
            <span className="text-sm font-bold uppercase text-foreground/50 tracking-widest">Online Passes</span>
            <span className="text-3xl font-black text-green-600">{onlinePassesCount}</span>
          </div>
          <div className="bg-white p-4 border border-foreground/10 shadow-sm flex flex-col items-center text-center">
            <span className="text-sm font-bold uppercase text-foreground/50 tracking-widest">Offline Passes</span>
            <span className="text-3xl font-black text-blue-600">{offlinePassesCount}</span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 border border-foreground/10 shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Filter className="text-foreground/50 w-5 h-5" />
            </div>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-3 px-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary font-medium"
            >
              <option value="All">All Types</option>
              <option value="Online">Online Passes</option>
              <option value="Offline">Offline Passes</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-3 px-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-foreground/10 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-foreground/5 text-foreground/80 text-xs uppercase tracking-wider font-bold">
                    <th className="p-4 border-b border-foreground/10">Name & Contact</th>
                    <th className="p-4 border-b border-foreground/10 text-center">Passes</th>
                    <th className="p-4 border-b border-foreground/10">Payment Proof</th>
                    <th className="p-4 border-b border-foreground/10">Status</th>
                    <th className="p-4 border-b border-foreground/10 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-foreground/60 italic">No registrations match your search.</td>
                    </tr>
                  ) : filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-foreground/10 hover:bg-brand-primary/5 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-foreground text-lg">{reg.name}</p>
                        <p className="text-sm text-foreground/70">{reg.phone} | {reg.email}</p>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary font-bold">
                          {reg.passes}
                        </span>
                      </td>
                      <td className="p-4">
                        {reg.screenshot ? (
                          <a href={reg.screenshot} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline font-medium text-sm">
                            <ExternalLink size={16} /> View Image
                          </a>
                        ) : (
                          <span className="text-red-500 text-sm">Missing</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                            reg.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {reg.status || 'Pending'}
                          </span>
                          {reg.claimedBy && reg.status !== 'Approved' && (
                            <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              Processing: {reg.claimedBy}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {reg.status !== 'Approved' ? (
                          <div className="flex items-center justify-end gap-2">
                            {(!reg.claimedBy || reg.claimedBy === adminName) ? (
                              <button
                                onClick={() => handleApprove(reg.id, reg.name, reg.phone, reg.passes)}
                                disabled={processingId === reg.id}
                                className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider disabled:opacity-50 transition-colors"
                              >
                                {processingId === reg.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                Approve
                              </button>
                            ) : (
                              <span className="text-sm font-bold text-foreground/50">Locked by {reg.claimedBy}</span>
                            )}
                            
                            {!reg.claimedBy && (
                              <button
                                onClick={() => handleClaim(reg.id)}
                                disabled={processingId === reg.id}
                                className="inline-flex items-center gap-2 bg-foreground text-white px-3 py-2 text-sm font-bold hover:bg-foreground/80 transition-colors"
                                title="Claim this ticket to process it"
                              >
                                <Hand size={16} />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-foreground/50 uppercase tracking-widest font-bold">Ticket ID</span>
                              <span className="text-sm font-mono bg-gray-100 px-2 py-1 mt-1 rounded text-foreground/80">{reg.ticketId?.substring(0,8)}...</span>
                            </div>
                            {reg.qrData && (
                              <div className="flex items-center gap-2 mt-1">
                                {reg.email && reg.email !== 'Offline' && reg.email.includes('@') && (
                                  <button
                                    onClick={() => handleResendEmail(reg.id)}
                                    disabled={processingId === reg.id}
                                    className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                                    title="Resend Pass via Email"
                                  >
                                    Email
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRevoke(reg.id)}
                                  disabled={processingId === reg.id}
                                  className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                                >
                                  {processingId === reg.id && <Loader2 size={12} className="animate-spin" />}
                                  Revoke
                                </button>
                                <button
                                  onClick={() => setQrModalData({ name: reg.name, data: reg.qrData as string, phone: reg.phone, passes: reg.passes, ticketId: reg.ticketId })}
                                  className="text-xs font-bold uppercase tracking-wider bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors"
                                >
                                  View Pass
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Success Modal */}
      {qrModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full flex flex-col items-center relative shadow-2xl">
            <button 
              onClick={() => setQrModalData(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-black text-green-600 mb-1">Approved!</h3>
            <p className="text-sm font-medium text-gray-600 mb-6 text-center">
              Pass generated for <span className="text-black font-bold">{qrModalData.name}</span>
            </p>
            
            <p className="text-sm font-bold text-gray-500 mb-6 text-center">
              An automated email with the digital pass has been sent if they provided a valid email address.
            </p>
            
            <div className="flex flex-col gap-3 w-full">
              {qrModalData.ticketId && (
                <button 
                  onClick={() => {
                    window.open(`/pass/${qrModalData.ticketId}`, '_blank');
                  }}
                  className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink size={20} /> View Digital Pass
                </button>
              )}
              
              <button 
                onClick={() => {
                  let message = "";
                  if (qrModalData.ticketId) {
                    message = encodeURIComponent(`Hi ${qrModalData.name},\n\nYour payment is approved! Here is the link to your official Garba pass for ${qrModalData.passes} people:\n\n${window.location.origin}/pass/${qrModalData.ticketId}\n\nPlease show the QR code on your pass at the entrance.`);
                  } else {
                    message = encodeURIComponent(`Hi ${qrModalData.name},\n\nYour payment is approved! Here is your Garba pass for ${qrModalData.passes} people.\n\nPlease show your QR code at the entrance.`);
                  }
                  const cleanPhone = qrModalData.phone.replace(/\D/g, '');
                  window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
                }}
                className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
              >
                Share via WhatsApp
              </button>
              <button 
                onClick={() => setQrModalData(null)}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Offline Pass Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-black text-brand-primary mb-6">Create Offline Pass</h3>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name *</label>
                <input required type="text" value={createFormData.name} onChange={e => setCreateFormData({...createFormData, name: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-brand-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number *</label>
                <input required type="tel" value={createFormData.phone} onChange={e => setCreateFormData({...createFormData, phone: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-brand-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Email Address (Optional)</label>
                <input type="email" value={createFormData.email} onChange={e => setCreateFormData({...createFormData, email: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-brand-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Number of Passes *</label>
                <input required type="number" min="1" max="10" value={createFormData.passes} onChange={e => setCreateFormData({...createFormData, passes: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-brand-primary" />
              </div>
              <button disabled={isCreating} type="submit" className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl mt-4 hover:bg-brand-primary/90 disabled:opacity-50 transition-colors">
                {isCreating ? "Creating..." : "Create & Generate QR"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
