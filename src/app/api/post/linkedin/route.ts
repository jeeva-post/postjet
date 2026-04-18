// 1. మెంబర్ ఐడీని కనుక్కోవడం (New OpenID Connect way)
    // మనం /me కి బదులు /userinfo ట్రై చేస్తున్నాం
    const meRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const meData = await meRes.json();

    if (!meRes.ok) {
      console.log("UserInfo Error:", meData);
      // ఒకవేళ /userinfo కూడా పని చేయకపోతే పాత /me ట్రై చేస్తుంది
      const legacyRes = await fetch("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const legacyData = await legacyRes.json();
      
      if (!legacyRes.ok) {
        return NextResponse.json({ 
          success: false, 
          error: "LinkedIn Permissions (Scopes) సరిగ్గా లేవు. దయచేసి openid, profile స్కోప్స్ ఉన్నాయో లేదో చూడండి." 
        });
      }
      var memberId = legacyData.id;
    } else {
      // /userinfo లో ఐడీని 'sub' అని పిలుస్తారు
      var memberId = meData.sub; 
    }

    console.log("Found Member ID:", memberId);