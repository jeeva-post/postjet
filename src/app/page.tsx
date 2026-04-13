import { getServerSession } from "next-auth";
import LogoutButton from "@/components/LogoutButton";
import FacebookLink from "@/components/FacebookLink";
import PinterestLink from "@/components/PinterestLink"; // 👈 ఇక్కడ బ్రాకెట్లు { } తీసేసాను
import UniversalPostForm from "@/components/UniversalPostForm";
import clientPromise from "@/lib/mongodb";
import { getFacebookPages } from "@/actions/facebook-actions";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "100vh", backgroundColor: "#f4f7f6", fontFamily: "Arial, sans-serif"
      }}>
        <h1 style={{ color: "#24292f" }}>PostJet కి స్వాగతం 🚀</h1>
        <p style={{ marginBottom: "20px" }}>కొనసాగించడానికి దయచేసి లాగిన్ అవ్వండి.</p>
        <a href="/api/auth/signin" style={{
          padding: "12px 24px", backgroundColor: "#24292f", color: "white",
          borderRadius: "6px", textDecoration: "none", fontWeight: "bold"
        }}>
          Login to Dashboard
        </a>
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ email: session.user?.email });
  
  let isFacebookLinked = false;
  let isPinterestLinked = false;
  let isInstagramLinked = false;
  let pages = [];

  if (user) {
    const fbAccount = await db.collection("accounts").findOne({ userId: user._id, provider: "facebook" });
    isFacebookLinked = !!fbAccount;

    const pinAccount = await db.collection("accounts").findOne({ userId: user._id, provider: "pinterest" });
    isPinterestLinked = !!pinAccount;

    if (isFacebookLinked) {
      pages = await getFacebookPages();
      isInstagramLinked = pages.some((page: any) => !!page.instagram_business_account);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#f0f2f5" }}>
      
      {/* Sidebar */}
      <nav style={{
        width: "260px", backgroundColor: "#1c1c1c", color: "white", padding: "20px",
        display: "flex", flexDirection: "column", position: "fixed", height: "100vh"
      }}>
        <h2 style={{ color: "#38bdf8", marginBottom: "40px", textAlign: "center" }}>PostJet</h2>
        <ul style={{ listStyle: "none", padding: 0, flex: 1 }}>
          <li style={{ padding: "12px 15px", borderRadius: "8px", backgroundColor: "#333", marginBottom: "10px", cursor: "pointer" }}>🏠 Dashboard</li>
          <li style={{ padding: "12px 15px", marginBottom: "10px", cursor: "pointer", color: "#ccc" }}>📱 Social Accounts</li>
          <li style={{ padding: "12px 15px", marginBottom: "10px", cursor: "pointer", color: "#ccc" }}>📝 Create Post</li>
        </ul>
        <LogoutButton />
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px", marginLeft: "260px" }}>
        <header style={{ marginBottom: "30px", borderBottom: "1px solid #ddd", paddingBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "28px" }}>నమస్కారం, {session.user?.name}! 👋</h1>
          <p style={{ color: "#666", marginTop: "5px" }}>మీ సోషల్ మీడియా నెట్‌వర్క్‌లను ఒకే చోట నిర్వహించండి.</p>
        </header>

        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <UniversalPostForm pages={pages} isPinterestLinked={isPinterestLinked} />

          <div style={{ 
            marginTop: "40px", 
            display: "grid", 
            gridTemplateColumns: "repeat(4, 1fr)", 
            gap: "12px" 
          }}>
            <div style={{ padding: "15px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", fontSize: "12px" }}>Telegram:</span>
              <span style={{ color: "#28a745", fontWeight: "bold", fontSize: "12px" }}>Connected ✅</span>
            </div>

            <div style={{ padding: "15px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", fontSize: "12px" }}>Pinterest:</span>
              <PinterestLink isLinked={isPinterestLinked} /> 
            </div>

            <div style={{ padding: "15px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", fontSize: "12px" }}>Instagram:</span>
              {isInstagramLinked ? (
                <span style={{ color: "#E1306C", fontWeight: "bold", fontSize: "12px" }}>Connected ✅</span>
              ) : (
                <span style={{ color: "#888", fontSize: "12px" }}>Not Linked ❌</span>
              )}
            </div>

            <div style={{ padding: "15px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", fontSize: "12px" }}>Facebook:</span>
              <FacebookLink isLinked={isFacebookLinked} /> 
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}