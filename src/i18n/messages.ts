export type AppMessages = {
  header: { tagline: string; region: string };
  nav: { home: string; roadmaps: string; advisor: string; trends: string; settings: string };
  common: {
    continueLearning: string;
    seeAll: string;
    comingSoon: string;
    reset: string;
    forYou: string;
    tapToExplore: string;
    openSource: string;
    noData: string;
    mockNote: string;
    backToTrends: string;
    back: string;
    close: string;
    loadingPage: string;
    primaryNav: string;
    errorEyebrow: string;
    errorTitle: string;
    errorDescription: string;
    tryAgain: string;
    returnHome: string;
  };
  home: {
    welcomeBack: string;
    headline: string;
    yourPath: string;
    keepMomentum: string;
    percentComplete: string;
    topicsCompleted: string;
    remaining: string;
    upNext: string;
    quickActions: string;
    recommended: string;
    internshipPrep: string;
    buildApplication: string;
    internshipDescription: string;
    resume: string;
    portfolio: string;
    github: string;
    steps: string;
    goalPrefix: string;
    addGoal: string;
    openPrepHub: string;
    marketSnapshot: string;
    skillsInDemand: string;
    marketEmpty: string;
    marketEmptyTitle: string;
    marketRetry: string;
    marketSource: string;
    roadmapEmptyTitle: string;
    roadmapEmptyDescription: string;
    advisorEyebrow: string;
    advisorTitle: string;
    advisorDescription: string;
    askAdvisor: string;
    continueTopic: string;
    continueTopicDetail: string;
    reviewInternship: string;
    reviewInternshipDetail: string;
    askPlan: string;
    askPlanDetail: string;
    roadmaps: string;
    roadmapsDetail: string;
    internship: string;
    internshipDetail: string;
    trends: string;
    trendsDetail: string;
    jobs: string;
    jobsDetail: string;
  };
  pages: {
    internshipPrep: { eyebrow: string; title: string; description: string; highlights: string[] };
    jobs: { eyebrow: string; title: string; description: string; highlights: string[] };
    trends: { eyebrow: string; title: string; description: string; highlights: string[] };
    roadmaps: {
      eyebrow: string;
      title: string;
      description: string;
      highlights: string[];
      empty: string;
      stagesItems: string;
      complete: string;
    };
    settings: { eyebrow: string; title: string; description: string; highlights: string[] };
    advisor: { eyebrow: string; title: string; description: string; highlights: string[] };
  };
  internshipPrep: {
    progressLabel: string;
    essentialsComplete: string;
    resetChecklist: string;
    applicationEssentials: string;
    essentialsTitle: string;
    essentialsDescription: string;
    quickTip: string;
    interviewPrep: string;
    interviewTitle: string;
    interviewDescription: string;
    doThis: string;
    practiceOutLoud: string;
    fiveQuestions: string;
    practiceTip: string;
    timeline: string;
    timelineTitle: string;
    timelineDescription: string;
    week: string;
    finishWith: string;
    nextStepTitle: string;
    nextStepDescription: string;
    chooseRoadmap: string;
    askAdvisor: string;
    saveError: string;
    marketFocusLabel: string;
    marketFocusTitle: string;
    marketFocusDescription: string;
    marketSkillsHeading: string;
    marketExtrasHeading: string;
    marketTipResume: string;
    marketTipPortfolio: string;
    marketTipInterview: string;
    marketFocusEmptyTitle: string;
    marketFocusEmptyDescription: string;
    viewTrends: string;
  };
  jobs: {
    emptyTitle: string;
    emptyDescription: string;
    viewTrends: string;
    levelIntern: string;
    levelJunior: string;
    levelUnknown: string;
    sourceLabel: string;
    loadingMore: string;
    endOfList: string;
    loadError: string;
    retry: string;
  };
  roadmapDetail: {
    sortLearning: string;
    sortDemand: string;
    demandHint: string;
    demandEmpty: string;
    demandShare: string;
    demandWhy: string;
    tierHot: string;
    tierRising: string;
    tierNoted: string;
    linkedSkill: string;
    listingsCount: string;
    demandTitle: string;
    demandDescription: string;
    fromSection: string;
    whyItMatters: string;
    expectedOutcome: string;
    nextTopic: string;
    backToRoadmaps: string;
    markComplete: string;
    markIncomplete: string;
    miniProjects: string;
    commonMistakes: string;
    resources: string;
  };
  trends: {
    filterLabel: string;
    filterTitle: string;
    dataSource: string;
    role: string;
    level: string;
    timeRange: string;
    allRoles: string;
    frontend: string;
    backend: string;
    fullstack: string;
    internJunior: string;
    internships: string;
    juniorRoles: string;
    last30: string;
    last90: string;
    allData: string;
    matchingListings: string;
    resetFilters: string;
    noMatchTitle: string;
    noMatchDescription: string;
    demandSignals: string;
    topSkills: string;
    shareOfListings: string;
    roleComparison: string;
    internVsJunior: string;
    comparisonDescription: string;
    measure: string;
    intern: string;
    junior: string;
    listings: string;
    topSkill: string;
    avgSkills: string;
    readCarefully: string;
    disclaimer: string;
    commonCombinations: string;
    stackCards: string;
    matchingListing: string;
    matchingListingsPlural: string;
    recentlyAdded: string;
    latestPreview: string;
    viewAllJobs: string;
    emptyTitle: string;
    emptyDescription: string;
    daysAgo: string;
  };
  profile: {
    details: string; detailsDescription: string; appearance: string; appearanceDescription: string;
    language: string; languageDescription: string; textSize: string; textSizeDescription: string;
    textSizeDefault: string; light: string; dark: string; system: string;
    english: string; burmese: string; targetRole: string; selectPath: string; frontend: string;
    backend: string; fullstack: string; currentLevel: string; selectLevel: string; beginner: string;
    intermediate: string; jobReady: string; universityYear: string; optional: string;
    internshipGoalDate: string; saveProfile: string; saving: string;
    chooseOption: string; chooseDate: string; cancel: string; done: string; notSet: string;
    onboardingTitle: string; onboardingDescription: string; setupLabel: string; continue: string;
    onboardingHint: string;
    editProfile: string; updateTitle: string; updateDescription: string;
  };
  pwa: {
    splashTitle: string;
    splashSubtitle: string;
    installBadge: string;
    installTitle: string;
    installDescription: string;
    installAction: string;
    installing: string;
    installReadyHint: string;
    installBrowserHint: string;
    installUnavailable: string;
    notNow: string;
    gotIt: string;
    iosStepShare: string;
    iosStepAdd: string;
    iosStepConfirm: string;
    iosShareLabel: string;
  };
  advisor: {
    emptyTitle: string;
    emptyDescription: string;
    promptNext: string;
    promptReady: string;
    promptProject: string;
    title: string;
    askLabel: string;
    sendMessage: string;
    needApiKey: string;
    requestFailed: string;
    openMenu: string;
    newChat: string;
    recentChats: string;
    noRecent: string;
    deleteChat: string;
    greeting: string;
  };
  settings: {
    byokEyebrow: string;
    byokTitle: string;
    byokDescription: string;
    providerLabel: string;
    apiKeyLabel: string;
    connected: string;
    notConnected: string;
    saveKey: string;
    replaceKey: string;
    removeKey: string;
    showKey: string;
    hideKey: string;
    keyPlaceholder: string;
    getApiKey: string;
    savedProviders: string;
    modelLabel: string;
    selectModel: string;
    searchModels: string;
    modelsLoading: string;
    modelsError: string;
    refreshModels: string;
    noModels: string;
    noKeyTitle: string;
    noKeyDescription: string;
    openSettings: string;
    sending: string;
    askPlaceholder: string;
    crawlEyebrow: string;
    crawlTitle: string;
    crawlDescription: string;
    crawlButton: string;
    crawlRunning: string;
    crawlModelHint: string;
    crawlSuccess: string;
    crawlSkillsAi: string;
    crawlSkillsDictionary: string;
    crawlFailed: string;
    crawlStepPrepare: string;
    crawlStepFetch: string;
    crawlStepExtract: string;
    crawlStepPublish: string;
    crawlStepDone: string;
    crawlElapsed: string;
    crawlLogStarting: string;
    crawlLogItem: string;
    crawlStatImported: string;
    crawlStatApproved: string;
    crawlStatDuplicate: string;
    crawlNavHint: string;
    crawlAlreadyRunning: string;
    toastKeySaved: string;
    toastKeyRemoved: string;
    toastProfileSaved: string;
    toastProfileError: string;
    toastCrawlSuccess: string;
    toastCrawlError: string;
  };
};

export const messages = {
  en: {
    header: { tagline: "Career Copilot for Myanmar", region: "Myanmar" },
    nav: { home: "Home", roadmaps: "Roadmaps", advisor: "Advisor", trends: "Trends", settings: "Settings" },
    common: {
      continueLearning: "Continue learning",
      seeAll: "See all →",
      comingSoon: "Coming soon",
      reset: "Reset",
      forYou: "For you",
      tapToExplore: "Tap to explore",
      openSource: "Open source ↗",
      noData: "No data yet",
      mockNote: "Based on approved Myanmar internship and junior listings.",
      backToTrends: "Trends",
      back: "Back",
      close: "Close",
      loadingPage: "Loading page",
      primaryNav: "Primary",
      errorEyebrow: "Something went wrong",
      errorTitle: "This page could not be loaded.",
      errorDescription:
        "The database or server may be temporarily unavailable. You can retry without losing your current browser session.",
      tryAgain: "Try again",
      returnHome: "Return home",
    },
    home: {
      welcomeBack: "Welcome back",
      headline: "Ready for your next step?",
      yourPath: "Your {path} path",
      keepMomentum: "Keep your momentum going",
      percentComplete: "{value}% complete",
      topicsCompleted: "{count} topics completed",
      remaining: "{count} remaining",
      upNext: "Up next",
      quickActions: "Quick actions",
      recommended: "Recommended actions",
      internshipPrep: "Internship prep",
      buildApplication: "Build a stronger application",
      internshipDescription: "Work through your resume, portfolio, GitHub, and interview checklist one practical step at a time.",
      resume: "Resume",
      portfolio: "Portfolio",
      github: "GitHub",
      steps: "{done}/{total} steps",
      goalPrefix: "Goal:",
      addGoal: "Add a goal date in your profile",
      openPrepHub: "Open prep hub",
      marketSnapshot: "Market snapshot",
      skillsInDemand: "Skills in demand",
      marketEmpty: "No market signals yet. Refresh listings from Settings when you are online.",
      marketEmptyTitle: "Market data unavailable",
      marketRetry: "Refresh in Settings",
      marketSource: "From approved Myanmar internship and junior-role listings.",
      roadmapEmptyTitle: "Roadmap data unavailable",
      roadmapEmptyDescription: "We could not load your learning path right now. Check your connection and try again.",
      advisorEyebrow: "AI Career Advisor",
      advisorTitle: "Not sure what to focus on next?",
      advisorDescription: "Ask for a focused learning plan, project recommendation, or internship readiness check.",
      askAdvisor: "Ask the Advisor",
      continueTopic: "Continue {title}",
      continueTopicDetail: "Complete the next topic in your learning path.",
      reviewInternship: "Review internship readiness",
      reviewInternshipDetail: "Check your resume, portfolio, GitHub, and interview preparation.",
      askPlan: "Ask for a focused plan",
      askPlanDetail: "Get a practical recommendation for your next week of learning.",
      roadmaps: "Roadmaps",
      roadmapsDetail: "Learn next",
      internship: "Internship",
      internshipDetail: "Get ready",
      trends: "Trends",
      trendsDetail: "View demand",
      jobs: "Jobs",
      jobsDetail: "Find roles",
    },
    pages: {
      internshipPrep: {
        eyebrow: "Internship Prep",
        title: "Internship preparation hub",
        description: "A focused checklist-driven space for portfolio, GitHub, resume, and interview preparation.",
        highlights: ["Resume and portfolio preparation checklists", "GitHub polish and project selection guidance", "A suggested 8 to 12 week intern prep plan"],
      },
      jobs: {
        eyebrow: "Jobs",
        title: "Approved jobs and internships",
        description: "Curated internship and junior openings from approved sources.",
        highlights: ["Curated internship and junior openings", "Source metadata and normalized descriptions", "Feeds skill trends on the market dashboard"],
      },
      trends: {
        eyebrow: "Market Trends",
        title: "Myanmar market trends dashboard",
        description: "Market signals for top skills, role comparisons, and stack demand across internships and junior roles.",
        highlights: ["Most requested skills and frameworks", "Internship vs junior role comparisons", "Filterable summaries from approved listings"],
      },
      roadmaps: {
        eyebrow: "Roadmaps",
        title: "Learning roadmaps for junior developers",
        description: "A structured place for frontend, backend, and fullstack tracks with stage-based progression and project milestones.",
        highlights: [
          "Curated frontend, backend, and fullstack paths",
          "Progressive stages from beginner to job-ready",
          "Project ideas, outcomes, and common mistakes",
        ],
        empty: "No roadmaps are published yet. Run the database seed to load curated content.",
        stagesItems: "{stages} stages · {items} items",
        complete: "{done}/{total} complete",
      },
      settings: {
        eyebrow: "Settings",
        title: "Settings",
        description: "Profile, theme, language, and AI keys.",
        highlights: ["Learner profile and goals", "Theme and language", "BYOK for Advisor"],
      },
      advisor: {
        eyebrow: "AI Career Advisor",
        title: "Grounded AI career advisor",
        description: "An advisor experience that combines profile data, roadmap progress, and trend signals for personalized next steps.",
        highlights: [
          "Skill-gap analysis and next-step guidance",
          "Suggested projects and learning priorities",
          "Prompting grounded in internal content",
        ],
      },
    },
    internshipPrep: {
      progressLabel: "Your prep progress",
      essentialsComplete: "{done} of {total} essentials complete",
      resetChecklist: "Reset checklist",
      applicationEssentials: "Application essentials",
      essentialsTitle: "Build a credible first impression.",
      essentialsDescription: "Work through one card at a time. Specific proof of your skills beats a long list of claims.",
      quickTip: "Quick tip:",
      interviewPrep: "Interview preparation",
      interviewTitle: "Practice explaining, not memorizing.",
      interviewDescription: "Interviewers are looking for clear thinking, honest communication, and solid foundations—not perfect answers.",
      doThis: "Do this:",
      practiceOutLoud: "Practice out loud",
      fiveQuestions: "Five questions to rehearse",
      practiceTip: "Keep each answer under two minutes. End with what you learned or how you improved.",
      timeline: "Suggested timeline",
      timelineTitle: "Your 8-week preparation plan.",
      timelineDescription: "Plan for 5–7 focused hours each week. If you need more time, repeat a week instead of rushing the output.",
      week: "Week",
      finishWith: "Finish with:",
      nextStepTitle: "Ready for your next step?",
      nextStepDescription: "Compare your skills with a roadmap, then use this plan to close the gaps.",
      chooseRoadmap: "Choose a roadmap",
      askAdvisor: "Ask the advisor",
      saveError: "Progress could not be saved. Check the database connection and try again.",
      marketFocusLabel: "This week’s market focus",
      marketFocusTitle: "Aim your prep at real Myanmar demand.",
      marketFocusDescription: "Based on {count} approved internship and junior listings. Your checklist stays the same—use these signals to prioritize proof.",
      marketSkillsHeading: "Most requested skills",
      marketExtrasHeading: "Extra focus (optional)",
      marketTipResume: "Resume: put {skill} and {skillB} near the top of your skills list only if you can explain them in an interview.",
      marketTipPortfolio: "Portfolio: feature one project that clearly shows {skill} (or {skillB}) with a short problem → approach → result story.",
      marketTipInterview: "Interview: practice a 90-second explanation of how you used {skill}—what broke, what you tried, what you shipped.",
      marketFocusEmptyTitle: "No market signals yet",
      marketFocusEmptyDescription: "Refresh approved listings from Settings when you are online. Your curated checklist still works without this section.",
      viewTrends: "View full market trends",
    },
    jobs: {
      emptyTitle: "No jobs yet",
      emptyDescription: "Published internship and junior listings will appear here. Trends use the same dataset.",
      viewTrends: "View trends",
      levelIntern: "Intern",
      levelJunior: "Junior",
      levelUnknown: "Unspecified",
      sourceLabel: "Source",
      loadingMore: "Loading more jobs…",
      endOfList: "You have reached the end of the list.",
      loadError: "Could not load jobs. Check your connection and try again.",
      retry: "Retry",
    },
    roadmapDetail: {
      sortLearning: "Learning order",
      sortDemand: "Market demand",
      demandHint: "Badges use approved {role} listings from Trends.",
      demandEmpty: "No matching skill demand yet. Refresh market data from Settings.",
      demandShare: "{share}% of listings",
      demandWhy: "Appears in {share}% of approved {role} listings because of {skill}.",
      tierHot: "Hot",
      tierRising: "Rising",
      tierNoted: "In demand",
      linkedSkill: "Linked skill: {skill}",
      listingsCount: "{count} listings",
      demandTitle: "Ranked by market demand",
      demandDescription: "All topics across this roadmap, sorted by how often linked skills appear in approved {role} jobs.",
      fromSection: "{section}",
      whyItMatters: "Why it matters",
      expectedOutcome: "Expected outcome",
      nextTopic: "Suggested next topic",
      backToRoadmaps: "Back to roadmaps",
      markComplete: "Mark complete",
      markIncomplete: "Mark incomplete",
      miniProjects: "Mini projects",
      commonMistakes: "Common mistakes",
      resources: "Resources",
    },
    trends: {
      filterLabel: "Filter market snapshot",
      filterTitle: "Focus the data on your target.",
      dataSource: "Approved listings · Live from database",
      role: "Role",
      level: "Level",
      timeRange: "Time range",
      allRoles: "All developer roles",
      frontend: "Frontend",
      backend: "Backend",
      fullstack: "Fullstack",
      internJunior: "Intern + junior",
      internships: "Internships",
      juniorRoles: "Junior roles",
      last30: "Last 30 days",
      last90: "Last 90 days",
      allData: "All approved data",
      matchingListings: "matching listings",
      resetFilters: "Reset filters",
      noMatchTitle: "No matching trend data",
      noMatchDescription: "Try expanding the role, level, or time range.",
      demandSignals: "Demand signals",
      topSkills: "Top requested skills",
      shareOfListings: "Share of matching listings",
      roleComparison: "Role comparison",
      internVsJunior: "Internship vs junior",
      comparisonDescription: "How expectations differ within your current filters.",
      measure: "Measure",
      intern: "Intern",
      junior: "Junior",
      listings: "Listings",
      topSkill: "Top skill",
      avgSkills: "Avg. skills",
      readCarefully: "Read this carefully:",
      disclaimer: "Counts show patterns in approved listings, not guaranteed hiring requirements.",
      commonCombinations: "Common combinations",
      stackCards: "Stack trend cards",
      matchingListing: "matching listing",
      matchingListingsPlural: "matching listings",
      recentlyAdded: "Recently added",
      latestPreview: "Latest jobs preview",
      viewAllJobs: "View all jobs",
      emptyTitle: "No market data yet",
      emptyDescription: "Add job listings to the database to populate skills, stacks, and role comparisons.",
      daysAgo: "{days}d ago",
    },
    profile: {
      details: "Profile details", detailsDescription: "Personalize your roadmap and internship guidance.", appearance: "Appearance", appearanceDescription: "Choose how NextStep MM looks on this device.",
      language: "Language", languageDescription: "Choose the language used in the app.",
      textSize: "Text size", textSizeDescription: "Adjust text size across the whole app.", textSizeDefault: "Default",
      light: "Light", dark: "Dark", system: "System", english: "English", burmese: "မြန်မာ",
      targetRole: "Target role", selectPath: "Select a path", frontend: "Frontend developer", backend: "Backend developer", fullstack: "Fullstack developer",
      currentLevel: "Current level", selectLevel: "Select your level", beginner: "Beginner", intermediate: "Intermediate", jobReady: "Job-ready", universityYear: "University year", optional: "Optional",
      internshipGoalDate: "Internship goal date", saveProfile: "Save profile", saving: "Saving…",
      chooseOption: "Choose an option", chooseDate: "Choose a date", cancel: "Cancel", done: "Done", notSet: "Not set",
      onboardingTitle: "Set up your learning profile", onboardingDescription: "Tell us where you are now so NextStep MM can recommend a clearer path.", setupLabel: "One-time setup", continue: "Continue to NextStep",
      onboardingHint: "You can change appearance and language later from Settings.",
      editProfile: "Edit profile", updateTitle: "Update your profile", updateDescription: "Keep your goals and current learning level accurate.",
    },
    pwa: {
      splashTitle: "NextStep MM",
      splashSubtitle: "Career roadmaps for Myanmar juniors",
      installBadge: "Progressive web app",
      installTitle: "Install NextStep MM",
      installDescription: "Add the app to your home screen for faster access, offline fallback, and a focused full-screen experience.",
      installAction: "Install app",
      installing: "Installing…",
      installReadyHint: "Tap Install app to add NextStep MM to your device.",
      installBrowserHint: "If the install prompt does not open, use your browser menu and choose Install app or Add to Home screen.",
      installUnavailable: "Install is not available in this browser yet. Try Chrome/Edge on Android, or use the browser menu → Install app.",
      notNow: "Not now",
      gotIt: "Got it",
      iosStepShare: "Tap the Share button in Safari",
      iosStepAdd: "Choose Add to Home Screen",
      iosStepConfirm: "Confirm Add to install NextStep MM",
      iosShareLabel: "Share",
    },
    advisor: {
      emptyTitle: "What should we focus on?",
      emptyDescription: "Ask about your next skill, internship readiness, or a portfolio project grounded in Myanmar market demand.",
      promptNext: "What should I learn next?",
      promptReady: "Am I ready for an internship?",
      promptProject: "Which portfolio project should I build?",
      title: "NextStep Advisor",
      askLabel: "Ask the advisor",
      sendMessage: "Send message",
      needApiKey: "Add an API key in Settings before chatting.",
      requestFailed: "Advisor request failed.",
      openMenu: "Open menu",
      newChat: "New chat",
      recentChats: "Recent",
      noRecent: "No recent chats yet",
      deleteChat: "Delete",
      greeting: "Hello",
    },
    settings: {
      byokEyebrow: "Bring your own key",
      byokTitle: "AI providers",
      byokDescription: "Keys stay on this device only. Choose a provider, then paste its API key.",
      providerLabel: "Provider",
      apiKeyLabel: "API key",
      connected: "Connected",
      notConnected: "Not set",
      saveKey: "Save key",
      replaceKey: "Replace key",
      removeKey: "Remove",
      showKey: "Show",
      hideKey: "Hide",
      keyPlaceholder: "Paste your API key",
      getApiKey: "Get an API key",
      savedProviders: "Saved providers",
      modelLabel: "Model",
      selectModel: "Choose a model",
      searchModels: "Search models",
      modelsLoading: "Loading models from your provider…",
      modelsError: "Could not refresh the live model list. Showing available defaults.",
      refreshModels: "Refresh",
      noModels: "No models match your search.",
      noKeyTitle: "Add an API key first",
      noKeyDescription: "Open Settings and connect Gemini or OpenRouter to start chatting with Advisor.",
      openSettings: "Open Settings",
      sending: "Thinking…",
      askPlaceholder: "Ask advisor",
      crawlEyebrow: "Market data",
      crawlTitle: "Refresh listings",
      crawlDescription: "Pull new internship and junior openings into Trends and Jobs.",
      crawlButton: "Refresh now",
      crawlRunning: "Refreshing…",
      crawlModelHint:
        "Skill reading uses your OpenRouter key with {model}. Without it, a built-in keyword list is used.",
      crawlSuccess: "Done. Imported {imported}, approved {approved}, duplicates {duplicate}.",
      crawlSkillsAi: " AI read skills for {count} listing(s).",
      crawlSkillsDictionary: " Skills used the built-in keyword list.",
      crawlFailed: "Refresh failed. Try again shortly.",
      crawlStepPrepare: "Getting ready",
      crawlStepFetch: "Collecting openings",
      crawlStepExtract: "Reading skills",
      crawlStepPublish: "Publishing",
      crawlStepDone: "Complete",
      crawlElapsed: "{seconds}s",
      crawlLogStarting: "Starting refresh…",
      crawlLogItem: "Processing {current}/{total}: {title}",
      crawlStatImported: "Imported",
      crawlStatApproved: "Approved",
      crawlStatDuplicate: "Duplicates",
      crawlNavHint: "You can leave — refresh continues in the background.",
      crawlAlreadyRunning: "A refresh is already running.",
      toastKeySaved: "API key saved",
      toastKeyRemoved: "API key removed",
      toastProfileSaved: "Profile updated",
      toastProfileError: "Profile update failed",
      toastCrawlSuccess: "Market data updated",
      toastCrawlError: "Refresh failed",
    },
  },
  my: {
    header: { tagline: "မြန်မာလူငယ်များအတွက် Career Copilot", region: "မြန်မာ" },
    nav: { home: "ပင်မ", roadmaps: "လမ်းညွှန်", advisor: "အကြံပေး", trends: "ဈေးကွက်", settings: "ဆက်တင်" },
    common: {
      continueLearning: "ဆက်လေ့လာပါ",
      seeAll: "အားလုံးကြည့်ရန် →",
      comingSoon: "မကြာမီ ရရှိနိုင်မည်",
      reset: "ပြန်သတ်မှတ်မည်",
      forYou: "သင့်အတွက်",
      tapToExplore: "နှိပ်ပြီးကြည့်ပါ",
      openSource: "မူရင်းစာမျက်နှာ ဖွင့်ရန် ↗",
      noData: "ဒေတာမရှိသေးပါ",
      mockNote: "အတည်ပြုထားသော မြန်မာနိုင်ငံရှိ အလုပ်သင်နှင့် အငယ်တန်းအလုပ်ခေါ်စာများကို အခြေခံထားသည်။",
      backToTrends: "ဈေးကွက်အခြေအနေ",
      back: "နောက်သို့",
      close: "ပိတ်ရန်",
      loadingPage: "စာမျက်နှာ ဖွင့်နေသည်",
      primaryNav: "အဓိက လမ်းညွှန်",
      errorEyebrow: "တစ်ခုခု မှားယွင်းနေသည်",
      errorTitle: "ဤစာမျက်နှာကို ဖွင့်၍ မရပါ။",
      errorDescription:
        "ဒေတာဘေ့စ် သို့မဟုတ် ဆာဗာ ယာယီ မရနိုင်ပါ။ လက်ရှိ browser session မပျက်ဘဲ ထပ်ကြိုးစားနိုင်ပါသည်။",
      tryAgain: "ထပ်ကြိုးစားမည်",
      returnHome: "ပင်မသို့ ပြန်ရန်",
    },
    home: {
      welcomeBack: "ပြန်လည်ကြိုဆိုပါတယ်",
      headline: "နောက်တစ်ဆင့်အတွက် အဆင်သင့်လား?",
      yourPath: "သင့် {path} လမ်းကြောင်း",
      keepMomentum: "ဒီအရှိန်အတိုင်း ဆက်လေ့လာပါ",
      percentComplete: "{value}% ပြီးစီးပါပြီ",
      topicsCompleted: "သင်ခန်းစာ {count} ခု ပြီးပါပြီ",
      remaining: "{count} ခု ကျန်သေးသည်",
      upNext: "ဆက်လေ့လာရန်",
      quickActions: "အမြန်လုပ်ဆောင်ချက်များ",
      recommended: "အကြံပြုလုပ်ဆောင်ချက်များ",
      internshipPrep: "အလုပ်သင်ပြင်ဆင်မှု",
      buildApplication: "အလုပ်လျှောက်ရန် ပိုမိုကောင်းမွန်စွာ ပြင်ဆင်ပါ",
      internshipDescription: "ကိုယ်ရေးရာဇဝင်၊ portfolio၊ GitHub နှင့် အင်တာဗျူးအတွက် လိုအပ်ချက်များကို တစ်ဆင့်ချင်း ပြင်ဆင်ပါ။",
      resume: "Resume",
      portfolio: "Portfolio",
      github: "GitHub",
      steps: "{total} ဆင့်အနက် {done} ဆင့် ပြီးပါပြီ",
      goalPrefix: "ပန်းတိုင်:",
      addGoal: "ပရိုဖိုင်တွင် ရည်မှန်းရက် ထည့်ပါ",
      openPrepHub: "ပြင်ဆင်ရေးစင်တာသို့ သွားရန်",
      marketSnapshot: "ဈေးကွက်အနှစ်ချုပ်",
      skillsInDemand: "လိုအပ်နေသော ကျွမ်းကျင်မှုများ",
      marketEmpty: "ဈေးကွက်အချက်အလက် မရှိသေးပါ။ အင်တာနက်ချိတ်ဆက်ထားချိန်တွင် ဆက်တင်များမှ အလုပ်ခေါ်စာများကို ပြန်လည်ရယူပါ။",
      marketEmptyTitle: "ဈေးကွက်အချက်အလက် မရရှိနိုင်သေးပါ",
      marketRetry: "ဆက်တင်များမှ ပြန်လည်ရယူရန်",
      marketSource: "အတည်ပြုထားသော မြန်မာနိုင်ငံရှိ အလုပ်သင်နှင့် အငယ်တန်းအလုပ်ခေါ်စာများမှ ရယူထားသည်။",
      roadmapEmptyTitle: "လေ့လာရေးလမ်းညွှန် မရရှိနိုင်သေးပါ",
      roadmapEmptyDescription: "သင့်လေ့လာရေးလမ်းညွှန်ကို ယခု မဖွင့်နိုင်သေးပါ။ အင်တာနက်ချိတ်ဆက်မှုကို စစ်ပြီး ထပ်ကြိုးစားပါ။",
      advisorEyebrow: "AI Career Advisor",
      advisorTitle: "ဘာကို ဦးစားပေးရမည် မသေချာဘူးလား?",
      advisorDescription: "သင့်တော်သော လေ့လာရေးအစီအစဉ်၊ ပရောဂျက်အကြံပြုချက် သို့မဟုတ် အလုပ်သင်လျှောက်ရန် အသင့်ဖြစ်မဖြစ် မေးမြန်းပါ။",
      askAdvisor: "AI အကြံပေးကို မေးရန်",
      continueTopic: "{title} ကို ဆက်လေ့လာပါ",
      continueTopicDetail: "သင့်လေ့လာရေးလမ်းညွှန်ရှိ နောက်သင်ခန်းစာကို ပြီးအောင်လေ့လာပါ။",
      reviewInternship: "အလုပ်သင်လျှောက်ရန် အသင့်ဖြစ်မဖြစ် စစ်ဆေးပါ",
      reviewInternshipDetail: "ကိုယ်ရေးရာဇဝင်၊ portfolio၊ GitHub နှင့် အင်တာဗျူးပြင်ဆင်မှုကို စစ်ဆေးပါ။",
      askPlan: "သင့်အတွက် လေ့လာရေးအစီအစဉ် တောင်းပါ",
      askPlanDetail: "လာမည့်တစ်ပတ်အတွက် လက်တွေ့ကျသော အကြံပြုချက် ရယူပါ။",
      roadmaps: "လေ့လာရေးလမ်းညွှန်",
      roadmapsDetail: "ဆက်လေ့လာရန်",
      internship: "အလုပ်သင်",
      internshipDetail: "ပြင်ဆင်ပါ",
      trends: "ဈေးကွက်အခြေအနေ",
      trendsDetail: "အလုပ်ဈေးကွက်လိုအပ်ချက်",
      jobs: "အလုပ်များ",
      jobsDetail: "ရှာဖွေရန်",
    },
    pages: {
      internshipPrep: {
        eyebrow: "အလုပ်သင်ပြင်ဆင်မှု",
        title: "အလုပ်သင်ပြင်ဆင်ရေး စင်တာ",
        description: "Portfolio၊ GitHub၊ ကိုယ်ရေးရာဇဝင်နှင့် အင်တာဗျူးအတွက် အဆင့်လိုက် စစ်ဆေးနိုင်သော လမ်းညွှန်ချက်များ။",
        highlights: ["ကိုယ်ရေးရာဇဝင်နှင့် portfolio စစ်ဆေးရန်စာရင်း", "GitHub ပြင်ဆင်မှုနှင့် ပရောဂျက်ရွေးချယ်ရေးလမ်းညွှန်", "၈ ပတ်မှ ၁၂ ပတ်အထိ အကြံပြုအစီအစဉ်"],
      },
      jobs: {
        eyebrow: "အလုပ်များ",
        title: "အတည်ပြုထားသော အလုပ်နှင့် အလုပ်သင်ခေါ်စာများ",
        description: "ယုံကြည်ရသော အရင်းအမြစ်များမှ အလုပ်သင်နှင့် အငယ်တန်းအလုပ်ခေါ်စာများ။",
        highlights: ["ရွေးချယ်စိစစ်ထားသော အလုပ်သင်နှင့် အငယ်တန်းအလုပ်များ", "မူရင်းအရင်းအမြစ်နှင့် အလုပ်ဖော်ပြချက်များ", "အလုပ်ဈေးကွက်အခြေအနေ တွက်ချက်ရန် အခြေခံအချက်အလက်"],
      },
      trends: {
        eyebrow: "ဈေးကွက်လမ်းကြောင်း",
        title: "မြန်မာအလုပ်ဈေးကွက် အခြေအနေပြ ဒက်ရှ်ဘုတ်",
        description: "အလုပ်သင်နှင့် အငယ်တန်းအလုပ်များတွင် လိုအပ်သော ကျွမ်းကျင်မှု၊ အလုပ်အမျိုးအစားနှင့် နည်းပညာအစုအဖွဲ့များကို ကြည့်ရှုပါ။",
        highlights: ["အများဆုံးတောင်းဆိုသော ကျွမ်းကျင်မှုများ", "အလုပ်သင်နှင့် အငယ်တန်းအလုပ် နှိုင်းယှဉ်ချက်", "အတည်ပြုအလုပ်ခေါ်စာများမှ စစ်ထုတ်ကြည့်နိုင်သော အနှစ်ချုပ်"],
      },
      roadmaps: {
        eyebrow: "လမ်းညွှန်",
        title: "Junior developer များအတွက် လေ့လာရေးလမ်းညွှန်",
        description: "Frontend၊ Backend နှင့် Fullstack လမ်းကြောင်းများကို အဆင့်လိုက် လေ့လာနိုင်သော ဖွဲ့စည်းထားသော လမ်းညွှန်။",
        highlights: [
          "Frontend၊ Backend နှင့် Fullstack လမ်းကြောင်းများ",
          "အခြေခံမှ အလုပ်လျှောက်ရန်အဆင့်အထိ တိုးတက်မှု",
          "ပရောဂျက်အကြံပြုချက်၊ ရလဒ်နှင့် အဖြစ်များသော အမှားများ",
        ],
        empty: "လေ့လာရေးလမ်းညွှန် မရှိသေးပါ။ Curated content တင်ရန် database seed ကို လုပ်ဆောင်ပါ။",
        stagesItems: "အဆင့် {stages} ခု · သင်ခန်းစာ {items} ခု",
        complete: "{total} ခုအနက် {done} ခု ပြီးပါပြီ",
      },
      settings: {
        eyebrow: "ဆက်တင်",
        title: "ဆက်တင်များ",
        description: "ပရိုဖိုင်၊ အသွင်အပြင်၊ ဘာသာစကားနှင့် AI key များ။",
        highlights: ["သင်ယူသူပရိုဖိုင်နှင့် ရည်မှန်းချက်များ", "အသွင်အပြင်နှင့် ဘာသာစကား", "Advisor အတွက် ကိုယ်ပိုင် API key"],
      },
      advisor: {
        eyebrow: "AI Career Advisor",
        title: "အချက်အလက်အခြေခံ AI အကြံပေး",
        description: "ပရိုဖိုင်၊ လေ့လာရေးတိုးတက်မှုနှင့် ဈေးကွက်အချက်အလက်များကို ပေါင်းစပ်ပြီး လက်တွေ့ကျသော နောက်တစ်ဆင့် အကြံပြုချက်ပေးသည်။",
        highlights: [
          "ကျွမ်းကျင်မှုကွာဟချက်နှင့် နောက်တစ်ဆင့်လမ်းညွှန်",
          "အကြံပြုပရောဂျက်နှင့် လေ့လာရေးဦးစားပေးများ",
          "အတွင်းပိုင်းအချက်အလက်အပေါ် အခြေခံသော အကြံပြုချက်",
        ],
      },
    },
    internshipPrep: {
      progressLabel: "သင့်ပြင်ဆင်မှု တိုးတက်မှု",
      essentialsComplete: "အရေးကြီးအချက် {total} ခုအနက် {done} ခု ပြီးပါပြီ",
      resetChecklist: "Checklist ပြန်သတ်မှတ်မည်",
      applicationEssentials: "လျှောက်လွှာအရေးကြီးအချက်များ",
      essentialsTitle: "ပထမဆုံးအမြင်ကောင်း ရရှိအောင် ပြင်ဆင်ပါ။",
      essentialsDescription: "ကတ်တစ်ခုချင်းစီကို အဆင့်လိုက် လုပ်ဆောင်ပါ။ ရှည်လျားသော မိတ်ဆက်စာထက် လက်တွေ့သက်သေပြနိုင်သော ကျွမ်းကျင်မှုက ပိုအရေးကြီးသည်။",
      quickTip: "အကြံပြုချက်:",
      interviewPrep: "Interview ပြင်ဆင်မှု",
      interviewTitle: "အလွတ်ကျက်ခြင်းမဟုတ်၊ ရှင်းပြနိုင်အောင် လေ့ကျင့်ပါ။",
      interviewDescription: "အင်တာဗျူးမေးသူများက ရှင်းလင်းစွာ စဉ်းစားနိုင်မှု၊ ရိုးသားစွာ ဆက်သွယ်နိုင်မှုနှင့် ခိုင်မာသော အခြေခံဗဟုသုတကို အဓိကကြည့်ကြသည်။",
      doThis: "လုပ်ဆောင်ရန်:",
      practiceOutLoud: "အသံထွက်၍ ဖြေဆိုလေ့ကျင့်ပါ",
      fiveQuestions: "လေ့ကျင့်ရန် မေးခွန်း ၅ ခု",
      practiceTip: "အဖြေတစ်ခုကို နှစ်မိနစ်အတွင်း ပြောနိုင်အောင် လေ့ကျင့်ပါ။ သင်ယူခဲ့သည့်အရာ သို့မဟုတ် တိုးတက်လာပုံဖြင့် အဆုံးသတ်ပါ။",
      timeline: "အကြံပြုအချိန်ဇယား",
      timelineTitle: "သင့် ၈ ပတ် ပြင်ဆင်ရေး အစီအစဉ်။",
      timelineDescription: "တစ်ပတ်လျှင် ၅–၇ နာရီ အာရုံစိုက်လုပ်ပါ။ အချိန်မလောက်ပါက အလျင်စလို မလုပ်ဘဲ ထိုအပတ်အစီအစဉ်ကို ထပ်မံလုပ်ဆောင်ပါ။",
      week: "အပတ်",
      finishWith: "အပတ်အပြီး ရရှိမည့်အရာ:",
      nextStepTitle: "နောက်တစ်ဆင့်အတွက် အဆင်သင့်လား?",
      nextStepDescription: "လေ့လာရေးလမ်းညွှန်နှင့် သင့်ကျွမ်းကျင်မှုများကို နှိုင်းယှဉ်ပြီး လိုအပ်နေသေးသည့်အရာများကို ဖြည့်ဆည်းပါ။",
      chooseRoadmap: "လေ့လာရေးလမ်းညွှန် ရွေးရန်",
      askAdvisor: "AI အကြံပေးကို မေးရန်",
      saveError: "တိုးတက်မှုကို မသိမ်းနိုင်ပါ။ ဒေတာဘေ့စ်ချိတ်ဆက်မှုကို စစ်ပြီး ထပ်ကြိုးစားပါ။",
      marketFocusLabel: "ဤအပတ်ဈေးကွက်အာရုံစိုက်ရန်",
      marketFocusTitle: "မြန်မာအလုပ်ဈေးကွက်လိုအပ်ချက်နှင့် ကိုက်ညီအောင် ပြင်ဆင်ပါ။",
      marketFocusDescription: "အတည်ပြုထားသော အလုပ်သင်/အငယ်တန်းအလုပ်ခေါ်စာ {count} ခုအပေါ် အခြေခံထားသည်။ Checklist အဓိကအချက်များ မပြောင်းပါ—သက်သေပြရန် ဦးစားပေးချက်အဖြစ် သုံးပါ။",
      marketSkillsHeading: "အများဆုံးတောင်းဆိုသော ကျွမ်းကျင်မှုများ",
      marketExtrasHeading: "အပိုအာရုံစိုက်ရန် (မဖြစ်မနေ မဟုတ်)",
      marketTipResume: "Resume: {skill} နှင့် {skillB} ကို အင်တာဗျူးတွင် ရှင်းပြနိုင်မှသာ skills စာရင်းထိပ်ပိုင်းတွင် ထည့်ပါ။",
      marketTipPortfolio: "Portfolio: {skill} (သို့မဟုတ် {skillB}) ကို ရှင်းလင်းစွာ ပြသသော ပရောဂျက်တစ်ခုကို problem → approach → result ပုံစံဖြင့် မီးမောင်းထိုးပြပါ။",
      marketTipInterview: "Interview: {skill} သုံးခဲ့ပုံကို ၉၀ စက္ကန့်အတွင်း—ဘာပျက်ခဲ့လဲ၊ ဘာလုပ်ခဲ့လဲ၊ ဘာတင်ခဲ့လဲ—ရှင်းပြနိုင်အောင် လေ့ကျင့်ပါ။",
      marketFocusEmptyTitle: "ဈေးကွက်အချက်အလက် မရှိသေးပါ",
      marketFocusEmptyDescription: "အွန်လိုင်းရှိချိန်တွင် ဆက်တင်များမှ အတည်ပြုအလုပ်ခေါ်စာများကို ပြန်လည်ရယူပါ။ ဤအပိုင်းမရှိလည်း သင့် checklist ကို ဆက်သုံးနိုင်ပါသည်။",
      viewTrends: "ဈေးကွက်အခြေအနေ အပြည့်ကြည့်ရန်",
    },
    jobs: {
      emptyTitle: "အတည်ပြုထားသော အလုပ်ခေါ်စာ မရှိသေးပါ",
      emptyDescription: "ထုတ်ဝေထားသော အလုပ်သင်နှင့် အငယ်တန်းအလုပ်ခေါ်စာများကို ဤနေရာတွင် ဖော်ပြပါမည်။ ဈေးကွက်အခြေအနေကိုလည်း ထိုအချက်အလက်များဖြင့် မွမ်းမံပေးပါမည်။",
      viewTrends: "ဈေးကွက်အခြေအနေ ကြည့်ရန်",
      levelIntern: "Intern",
      levelJunior: "Junior",
      levelUnknown: "မသတ်မှတ်",
      sourceLabel: "အရင်းအမြစ်",
      loadingMore: "အလုပ်ခေါ်စာ ထပ်မံ ဖွင့်နေသည်…",
      endOfList: "စာရင်းအဆုံးသို့ ရောက်ပါပြီ။",
      loadError: "အလုပ်ခေါ်စာများကို ဖွင့်၍ မရပါ။ ချိတ်ဆက်မှုကို စစ်ပြီး ထပ်ကြိုးစားပါ။",
      retry: "ထပ်ကြိုးစားမည်",
    },
    roadmapDetail: {
      sortLearning: "သင်ယူမှုအစဉ်",
      sortDemand: "စျေးကွက်လိုအပ်ချက်",
      demandHint: "လိုအပ်ချက်အမှတ်အသားများသည် အတည်ပြုထားသော {role} အလုပ်ခေါ်စာများကို အခြေခံထားသည်။",
      demandEmpty: "ကိုက်ညီသော ကျွမ်းကျင်မှုလိုအပ်ချက် မရှိသေးပါ။ ဆက်တင်များမှ ဈေးကွက်အချက်အလက်ကို ပြန်လည်ရယူပါ။",
      demandShare: "အလုပ်ခေါ်စာများ၏ {share}%",
      demandWhy: "အတည်ပြုထားသော {role} အလုပ်ခေါ်စာများ၏ {share}% တွင် {skill} ကို တောင်းဆိုထားသည်။",
      tierHot: "Hot",
      tierRising: "Rising",
      tierNoted: "ဖော်ပြထား",
      linkedSkill: "ဆက်စပ်ကျွမ်းကျင်မှု: {skill}",
      listingsCount: "အလုပ်ခေါ်စာ {count} ခု",
      demandTitle: "စျေးကွက်လိုအပ်ချက်အလိုက် အစဉ်",
      demandDescription: "လေ့လာရေးလမ်းညွှန်တစ်ခုလုံးရှိ သင်ခန်းစာများကို အတည်ပြုထားသော {role} အလုပ်ခေါ်စာများတွင် သက်ဆိုင်ရာကျွမ်းကျင်မှု ပါဝင်သည့်နှုန်းအလိုက် စီထားသည်။",
      fromSection: "{section}",
      whyItMatters: "ဘာကြောင့် အရေးကြီးသလဲ",
      expectedOutcome: "ရရှိမည့်ရလဒ်",
      nextTopic: "အကြံပြု နောက်သင်ခန်းစာ",
      backToRoadmaps: "လမ်းညွှန်စာရင်းသို့ ပြန်ရန်",
      markComplete: "ပြီးမြောက်ကြောင်း မှတ်ရန်",
      markIncomplete: "မပြီးသေးကြောင်း မှတ်ရန်",
      miniProjects: "Mini ပရောဂျက်များ",
      commonMistakes: "အဖြစ်များသော အမှားများ",
      resources: "အရင်းအမြစ်များ",
    },
    trends: {
      filterLabel: "ဈေးကွက်အနှစ်ချုပ်ကို စစ်ထုတ်ရန်",
      filterTitle: "သင့်ရည်မှန်းချက်နှင့် ကိုက်ညီသော အချက်အလက်များကို ရွေးချယ်ကြည့်ရှုပါ။",
      dataSource: "အတည်ပြုအလုပ်ခေါ်စာများ · ဒေတာဘေ့စ်မှ တိုက်ရိုက်",
      role: "အလုပ်အမျိုးအစား",
      level: "အဆင့်",
      timeRange: "အချိန်အပိုင်းအခြား",
      allRoles: "Developer အလုပ်အမျိုးအစားအားလုံး",
      frontend: "Frontend",
      backend: "Backend",
      fullstack: "Fullstack",
      internJunior: "အလုပ်သင် + အငယ်တန်း",
      internships: "အလုပ်သင်များ",
      juniorRoles: "အငယ်တန်းအလုပ်များ",
      last30: "နောက်ဆုံး ၃၀ ရက်",
      last90: "နောက်ဆုံး ၉၀ ရက်",
      allData: "အတည်ပြုဒေတာအားလုံး",
      matchingListings: "ကိုက်ညီသော စာရင်းများ",
      resetFilters: "စစ်ထုတ်မှု ပြန်သတ်မှတ်မည်",
      noMatchTitle: "ကိုက်ညီသော ဒေတာမရှိပါ",
      noMatchDescription: "အလုပ်အမျိုးအစား၊ အဆင့် သို့မဟုတ် အချိန်အပိုင်းအခြားကို ပိုမိုကျယ်ပြန့်စွာ ရွေးကြည့်ပါ။",
      demandSignals: "ဈေးကွက်လိုအပ်ချက်များ",
      topSkills: "အများဆုံးတောင်းဆိုသော ကျွမ်းကျင်မှုများ",
      shareOfListings: "ကိုက်ညီသော အလုပ်ခေါ်စာများအနက် ရာခိုင်နှုန်း",
      roleComparison: "အလုပ်အမျိုးအစားအလိုက် နှိုင်းယှဉ်ချက်",
      internVsJunior: "အလုပ်သင်နှင့် အငယ်တန်း",
      comparisonDescription: "လက်ရှိရွေးချယ်ထားသော အလုပ်ခေါ်စာများတွင် လိုအပ်ချက်များ ကွာခြားပုံ။",
      measure: "တိုင်းတာချက်",
      intern: "Intern",
      junior: "Junior",
      listings: "စာရင်းများ",
      topSkill: "အများဆုံးတောင်းဆိုသော ကျွမ်းကျင်မှု",
      avgSkills: "ပျမ်းမျှ ကျွမ်းကျင်မှုအရေအတွက်",
      readCarefully: "သတိပြုရန်:",
      disclaimer: "ဤကိန်းဂဏန်းများသည် အတည်ပြုအလုပ်ခေါ်စာများတွင် တွေ့ရသော ယေဘုယျပုံစံကိုသာ ဖော်ပြသည်။ အလုပ်တိုင်းအတွက် မဖြစ်မနေလိုအပ်ချက် မဟုတ်ပါ။",
      commonCombinations: "အတွေ့ရများသော ပေါင်းစပ်မှုများ",
      stackCards: "နည်းပညာအစုအဖွဲ့အလိုက် လမ်းကြောင်းများ",
      matchingListing: "ကိုက်ညီသော စာရင်း",
      matchingListingsPlural: "ကိုက်ညီသော စာရင်းများ",
      recentlyAdded: "မကြာသေးမီက ထည့်သွင်းထားသော အလုပ်များ",
      latestPreview: "နောက်ဆုံးအလုပ်ခေါ်စာများ",
      viewAllJobs: "အလုပ်အားလုံးကြည့်ရန်",
      emptyTitle: "ဈေးကွက်ဒေတာ မရှိသေးပါ",
      emptyDescription: "ဒေတာဘေ့စ်ထဲသို့ အလုပ်ခေါ်စာများ ထည့်ပြီးပါက ကျွမ်းကျင်မှု၊ နည်းပညာအစုအဖွဲ့နှင့် အလုပ်အမျိုးအစား နှိုင်းယှဉ်ချက်များ ပေါ်လာပါမည်။",
      daysAgo: "လွန်ခဲ့သော {days} ရက်",
    },
    profile: {
      details: "ပရိုဖိုင်အချက်အလက်", detailsDescription: "သင့်အခြေအနေနှင့် ကိုက်ညီသော လေ့လာရေးလမ်းညွှန်နှင့် အလုပ်သင်အကြံပြုချက်များ ရရှိအောင် ဖြည့်စွက်ပါ။", appearance: "အသွင်အပြင်", appearanceDescription: "ဤစက်တွင် NextStep MM ကို မည်သို့မြင်လိုသည်ကို ရွေးချယ်ပါ။",
      language: "ဘာသာစကား", languageDescription: "အက်ပ်တွင် အသုံးပြုမည့် ဘာသာစကားကို ရွေးချယ်ပါ။",
      textSize: "စာလုံးအရွယ်", textSizeDescription: "အက်ပ်တစ်ခုလုံးရှိ စာလုံးအရွယ်အစားကို ချိန်ညှိပါ။", textSizeDefault: "ပုံမှန်",
      light: "အလင်းပုံစံ", dark: "အမှောင်ပုံစံ", system: "စက်၏သတ်မှတ်ချက်အတိုင်း", english: "English", burmese: "မြန်မာ",
      targetRole: "ရည်မှန်းထားသော အလုပ်", selectPath: "လေ့လာရေးလမ်းကြောင်း ရွေးပါ", frontend: "Frontend Developer", backend: "Backend Developer", fullstack: "Fullstack Developer",
      currentLevel: "လက်ရှိအဆင့်", selectLevel: "အဆင့်ရွေးပါ", beginner: "အခြေခံအဆင့်", intermediate: "အလယ်အလတ်အဆင့်", jobReady: "အလုပ်လျှောက်ရန် အသင့်", universityYear: "တက္ကသိုလ်တက်နေသည့်နှစ်", optional: "မဖြည့်လည်း ရပါသည်",
      internshipGoalDate: "အလုပ်သင်လျှောက်ရန် ရည်မှန်းရက်", saveProfile: "ပရိုဖိုင်ကို သိမ်းမည်", saving: "သိမ်းနေသည်…",
      chooseOption: "ရွေးချယ်ပါ", chooseDate: "ရက်စွဲရွေးပါ", cancel: "မလုပ်တော့ပါ", done: "ပြီးပြီ", notSet: "မသတ်မှတ်ရသေးပါ",
      onboardingTitle: "သင့်လေ့လာရေးပရိုဖိုင်ကို သတ်မှတ်ပါ", onboardingDescription: "သင့်အတွက် သင့်တော်သော လမ်းညွှန်ချက်များ ပေးနိုင်ရန် လက်ရှိအခြေအနေကို ဖြည့်ပေးပါ။", setupLabel: "တစ်ကြိမ်သာ ဖြည့်ရန်", continue: "NextStep သို့ ဆက်သွားမည်",
      onboardingHint: "အသွင်အပြင်နှင့် ဘာသာစကားကို ဆက်တင်များတွင် နောက်မှ ပြောင်းနိုင်ပါသည်။",
      editProfile: "ပရိုဖိုင်ပြင်မည်", updateTitle: "ပရိုဖိုင်ကို ပြင်ဆင်ပါ", updateDescription: "သင့်ရည်မှန်းချက်နှင့် လက်ရှိလေ့လာမှုအဆင့်ကို နောက်ဆုံးအခြေအနေအတိုင်း ဖြည့်ထားပါ။",
    },
    pwa: {
      splashTitle: "NextStep MM",
      splashSubtitle: "မြန်မာလူငယ် developer များအတွက် လေ့လာရေးလမ်းညွှန်",
      installBadge: "Progressive web app",
      installTitle: "NextStep MM ကို ထည့်သွင်းရန်",
      installDescription: "Home Screen သို့ ထည့်ထားပါက ပိုမိုမြန်ဆန်စွာ ဖွင့်နိုင်ပြီး အင်တာနက်ပြတ်တောက်ချိန်တွင်လည်း အခြေခံစာမျက်နှာကို ကြည့်နိုင်ပါမည်။",
      installAction: "အက်ပ်ထည့်မည်",
      installing: "ထည့်နေသည်…",
      installReadyHint: "အက်ပ်ထည့်မည် ကို နှိပ်ပြီး NextStep MM ကို စက်ထဲ ထည့်နိုင်ပါသည်။",
      installBrowserHint: "Install prompt မပေါ်ပါက browser menu မှ Install app သို့မဟုတ် Add to Home screen ကို ရွေးပါ။",
      installUnavailable: "ဤ browser တွင် Install မရသေးပါ။ Android တွင် Chrome/Edge သုံးပါ၊ သို့မဟုတ် browser menu → Install app ကို စမ်းကြည့်ပါ။",
      notNow: "ယခုမဟုတ်",
      gotIt: "နားလည်ပါပြီ",
      iosStepShare: "Safari တွင် Share ခလုတ်ကို နှိပ်ပါ",
      iosStepAdd: "Add to Home Screen ကို ရွေးပါ",
      iosStepConfirm: "Add ကို အတည်ပြုပြီး NextStep MM ထည့်ပါ",
      iosShareLabel: "Share",
    },
    advisor: {
      emptyTitle: "ဘာကို အာရုံစိုက်မလဲ?",
      emptyDescription: "ဆက်လေ့လာသင့်သော ကျွမ်းကျင်မှု၊ အလုပ်သင်လျှောက်ရန် အသင့်ဖြစ်မဖြစ် သို့မဟုတ် မြန်မာအလုပ်ဈေးကွက်နှင့် ကိုက်ညီသော portfolio ပရောဂျက်အကြောင်း မေးမြန်းပါ။",
      promptNext: "ဘာကို ဆက်လေ့လာသင့်လဲ?",
      promptReady: "အလုပ်သင်လျှောက်ရန် အသင့်ဖြစ်ပြီလား?",
      promptProject: "Portfolio အတွက် ဘယ်ပရောဂျက် တည်ဆောက်သင့်လဲ?",
      title: "NextStep Advisor",
      askLabel: "AI အကြံပေးကို မေးရန်",
      sendMessage: "မက်ဆေ့ချ် ပို့ရန်",
      needApiKey: "စကားပြောမီ ဆက်တင်များတွင် API key ထည့်ပါ။",
      requestFailed: "Advisor တောင်းဆိုမှု မအောင်မြင်ပါ။",
      openMenu: "မီနူး ဖွင့်ရန်",
      newChat: "စကားပြောအသစ်",
      recentChats: "မကြာသေးမီက",
      noRecent: "မကြာသေးမီက စကားပြော မရှိသေးပါ",
      deleteChat: "ဖျက်မည်",
      greeting: "မင်္ဂလာပါ",
    },
    settings: {
      byokEyebrow: "ကိုယ်ပိုင် API key",
      byokTitle: "AI ပံ့ပိုးသူများ",
      byokDescription: "API key များကို ဤစက်ပေါ်တွင်သာ သိမ်းထားပါမည်။ ဝန်ဆောင်မှုပေးသူကို ရွေးပြီး API key ထည့်ပါ။",
      providerLabel: "Provider",
      apiKeyLabel: "API key",
      connected: "ချိတ်ဆက်ထားသည်",
      notConnected: "မထည့်ရသေး",
      saveKey: "Key သိမ်းမည်",
      replaceKey: "Key အစားထိုး",
      removeKey: "ဖယ်ရှား",
      showKey: "ပြရန်",
      hideKey: "ဖျောက်ရန်",
      keyPlaceholder: "API key ကူးထည့်ပါ",
      getApiKey: "API key ရယူရန်",
      savedProviders: "သိမ်းထားသော ဝန်ဆောင်မှုပေးသူများ",
      modelLabel: "Model",
      selectModel: "Model ရွေးပါ",
      searchModels: "Model ရှာရန်",
      modelsLoading: "သင့် provider မှ model စာရင်းကို ဖတ်ယူနေသည်…",
      modelsError: "Live model စာရင်းကို မရယူနိုင်သေးပါ။ ပုံမှန် model များကို ပြသထားသည်။",
      refreshModels: "ပြန်လည်ရယူရန်",
      noModels: "ရှာဖွေမှုနှင့် ကိုက်ညီသော model မရှိပါ။",
      noKeyTitle: "API key ကို အရင်ထည့်ပါ",
      noKeyDescription: "ဆက်တင်များသို့ သွားပြီး Gemini သို့မဟုတ် OpenRouter ကို ချိတ်ဆက်ပါ။",
      openSettings: "ဆက်တင်များ ဖွင့်ရန်",
      sending: "စဉ်းစားနေသည်…",
      askPlaceholder: "AI အကြံပေးကို မေးမြန်းပါ",
      crawlEyebrow: "ဈေးကွက်ဒေတာ",
      crawlTitle: "အလုပ်ခေါ်စာများကို ပြန်လည်ရယူရန်",
      crawlDescription: "အလုပ်သင်နှင့် အငယ်တန်းအလုပ်ခေါ်စာအသစ်များကို ဈေးကွက်အခြေအနေနှင့် အလုပ်များစာမျက်နှာသို့ ရယူပါ။",
      crawlButton: "ယခု ပြန်လည်ရယူမည်",
      crawlRunning: "ပြန်လည်ရယူနေသည်…",
      crawlModelHint:
        "ကျွမ်းကျင်မှုခွဲထုတ်ရန် OpenRouter key ({model}) ကို အသုံးပြုပါမည်။ key မရှိပါက built-in keyword list သုံးမည်။",
      crawlSuccess: "ပြီးပါပြီ။ အသစ် {imported} ခု၊ အတည်ပြု {approved} ခု၊ ထပ်နေသောစာရင်း {duplicate} ခု။",
      crawlSkillsAi: " AI ဖြင့် ကျွမ်းကျင်မှု {count} ခု ဖတ်ပြီးပါပြီ။",
      crawlSkillsDictionary: " ကျွမ်းကျင်မှုများကို built-in keyword list ဖြင့် ဖတ်ထားသည်။",
      crawlFailed: "အလုပ်ခေါ်စာများကို ပြန်လည်ရယူ၍ မရပါ။ ခဏနေမှ ထပ်ကြိုးစားပါ။",
      crawlStepPrepare: "ပြင်ဆင်နေသည်",
      crawlStepFetch: "အလုပ်များ စုဆောင်းနေသည်",
      crawlStepExtract: "ကျွမ်းကျင်မှုများ ခွဲထုတ်နေသည်",
      crawlStepPublish: "အလုပ်ခေါ်စာများ ထုတ်ပြန်နေသည်",
      crawlStepDone: "ပြီးပါပြီ",
      crawlElapsed: "{seconds} စက္ကန့်",
      crawlLogStarting: "အလုပ်ခေါ်စာများကို စတင်ရယူနေသည်…",
      crawlLogItem: "{current}/{total} စိစစ်နေသည်: {title}",
      crawlStatImported: "အသစ်ထည့်သွင်း",
      crawlStatApproved: "အတည်ပြုပြီး",
      crawlStatDuplicate: "ထပ်နေသောစာရင်း",
      crawlNavHint: "ဤစာမျက်နှာမှ ထွက်နိုင်ပါသည် — နောက်ကွယ်တွင် ဆက်လက်လုပ်ဆောင်ပါမည်။",
      crawlAlreadyRunning: "အလုပ်ခေါ်စာများကို ပြန်လည်ရယူနေဆဲ ဖြစ်သည်။",
      toastKeySaved: "API key သိမ်းပြီးပါပြီ",
      toastKeyRemoved: "API key ဖယ်ရှားပြီးပါပြီ",
      toastProfileSaved: "ပရိုဖိုင် ပြင်ဆင်ပြီးပါပြီ",
      toastProfileError: "ပရိုဖိုင် မသိမ်းနိုင်ပါ",
      toastCrawlSuccess: "ဈေးကွက်ဒေတာ အပ်ဒိတ်ပြီးပါပြီ",
      toastCrawlError: "ဈေးကွက်အချက်အလက်ကို ပြန်လည်ရယူ၍ မရပါ",
    },
  },
} satisfies Record<"en" | "my", AppMessages>;

export function formatMessage(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}
