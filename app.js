(function () {
  const stepTitles = [
    "Ready for you",
    "OTP confirmation",
    "Check eligibility",
    "Personal details",
    "Address and employment",
    "Employment codes",
    "Salary bank selection",
    "Income verification",
    "Income option",
    "Manual salary details",
    "Quick financial data",
    "Verify accounts",
    "Consent requested",
    "Consent review",
    "Consent approval",
    "Choose amount",
    "Offer calculation",
    "Address details",
    "Final verification",
    "Personal information"
  ];

  const steps = stepTitles.map((title, index) => ({
    index,
    code: `HDHC_PL${String(index + 1).padStart(2, "0")}_PL`,
    originalCode: `HDFC_PL${String(index + 1).padStart(2, "0")}_PL`,
    title
  }));

  let savedForLater = localStorage.getItem("hdhc-saved-for-later") === "true";
  const state = loadState();
  let current = savedForLater ? Number(localStorage.getItem("hdhc-current-step") || 0) : 0;
  let notice = "";

  function loadState() {
    const defaults = {
      mobile: "",
      dob: "",
      pan: "GZLPM2367E",
      idMode: "DOB",
      salaryAccountType: "",
      incomeSource: "Salaried",
      pep: "No",
      consentLoan: false,
      consentMarketing: false,
      otp: "",
      firstName: "KALYAN",
      middleName: "",
      lastName: "MANDAL",
      gender: "Male",
      email: "",
      loanType: "",
      address: "PLOT NO 37 UDYOG VIHAR PHASE IV GURGAON SINGH MANI NAGAR PAH HOUSE, GURGAON, HARYANA - 122016",
      changeAddress: false,
      employer: "HDHC Bank Employee",
      channel: "DSA",
      agentCode: "10001",
      smCode: "A0002",
      tmCode: "",
      tlCode: "120552",
      lcCode: "",
      pin: "122052",
      bank: "Kotak Bank",
      verificationMethod: "mobileOtp",
      accountAggregator: "Finvu",
      aaOtp: "",
      aaAccount: "Kotak Bank",
      loanAmount: 880000,
      tenure: 60,
      officeAddress1: "",
      officeAddress2: "",
      officeLandmark: "",
      city: "Gurgaon",
      state: "Haryana",
      personalEmail: "archanakumari.as28@gmail.com",
      workEmail: "archanakumari.as28@gmail.com",
      salaryMasked: "XXXXX9999",
      salaryAccount: "0247769999",
      ifsc: "KKBK0004257",
      bankName: "KOTAK MAHINDRA BANK LIMITED",
      branchName: "UDYOG VIHAR BRANCH GURGAON",
      referenceName: "SUMAN S",
      referencePhone: "7953939578"
    };
    if (savedForLater) {
      try {
        return { ...defaults, ...(JSON.parse(localStorage.getItem("hdhc-loan-state") || "{}")) };
      } catch {
        return defaults;
      }
    }
    return defaults;
  }

  function saveState() {
    if (!savedForLater) return;
    localStorage.setItem("hdhc-loan-state", JSON.stringify(state));
    localStorage.setItem("hdhc-current-step", String(current));
  }

  function saveForLater() {
    savedForLater = true;
    localStorage.setItem("hdhc-saved-for-later", "true");
    localStorage.setItem("hdhc-loan-state", JSON.stringify(state));
    localStorage.setItem("hdhc-current-step", String(current));
  }

  function setNotice(message) {
    notice = message;
    render();
  }

  function progressForStep(step) {
    if (step < 3) return step === 0 ? 0 : 5;
    if (step < 6) return 10;
    if (step < 10) return 20;
    if (step < 15) return 40;
    if (step < 17) return 60;
    return 75;
  }

  function appShell(body, options = {}) {
    const progress = progressForStep(current);
    const isLanding = current < 3;
    return `
      ${isLanding ? landingHeader() : standardHeader(progress)}
      ${isLanding ? "" : screenBar(progress)}
      <main class="layout single">
        <section class="content">${body}</section>
      </main>
      ${notice ? `<div class="notice" role="status">${notice}</div>` : ""}
      <footer class="footer"><span>(c) Copyright HDHC Bank Ltd.</span><a href="#" data-action="save">${savedForLater ? "Saved" : "Save For Later"}</a></footer>
    `;
  }

  function landingHeader() {
    return `
      <section class="hero">
        <div class="xpress"><span class="brand-mark">H</span> XPRESS Personal Loan</div>
        <h1>Ready for you</h1>
        <div class="hero-benefits" aria-label="Loan benefits">
          <div class="hero-benefit">% Interest Rate Starting @9.99%* p.a.</div>
          <div class="hero-benefit">Rs Balance Transfer & Top-up available</div>
          <div class="hero-benefit">Zero Foreclosure charges*</div>
        </div>
        <p class="small">*T&C Apply.</p>
      </section>
    `;
  }

  function standardHeader() {
    return `
      <header class="topbar">
        <div class="brand"><span class="brand-mark">H</span><span>HDHC BANK</span></div>
        <div class="help"><span class="help-icon">?</span><span>Help</span></div>
      </header>
    `;
  }

  function screenBar(progress) {
    const visibleStage = current < 16 ? Math.max(1, Math.min(5, current - 2)) : current < 18 ? 3 : 5;
    const title = current < 16 ? steps[current].title : current < 18 ? "Choose Amount" : "Personal Information";
    return `
      <div class="screen-bar">
        <span class="screen-num">${String(visibleStage).padStart(2, "0")}</span>
        <strong>${title}</strong>
        <span class="progress-donut" style="--p:${progress}%"></span>
        <span class="progress-label">${progress}% complete</span>
      </div>
    `;
  }

  function field(name, label, type = "text", extra = "") {
    const value = state[name] ?? "";
    return `
      <div class="field">
        <label for="${name}">${label}</label>
        <input class="input ${extra.includes("line") ? "line-input" : ""}" id="${name}" name="${name}" type="${type}" value="${escapeAttr(value)}" ${extra.replace("line", "")} />
      </div>
    `;
  }

  function selectField(name, label, options) {
    return `
      <div class="field">
        <label for="${name}">${label}</label>
        <select class="select" id="${name}" name="${name}">
          <option value="">Select</option>
          ${options.map((opt) => `<option value="${escapeAttr(opt)}" ${state[name] === opt ? "selected" : ""}>${opt}</option>`).join("")}
        </select>
      </div>
    `;
  }

  function radio(name, value, label) {
    return `<label class="radio"><input type="radio" name="${name}" value="${escapeAttr(value)}" ${state[name] === value ? "checked" : ""}>${label}</label>`;
  }

  function check(name, label) {
    return `<label class="check"><input type="checkbox" name="${name}" ${state[name] ? "checked" : ""}>${label}</label>`;
  }

  function render() {
    const screens = [
      screen01, screen02, screen03, screen04, screen05,
      screen06, screen07, screen08, screen09, screen10,
      screen11, screen12, screen13, screen14, screen15,
      screen16, screen17, screen18, screen19, screen20
    ];
    document.getElementById("app").innerHTML = appShell(screens[current](), { single: current < 3 });
    attachEvents();
  }

  function screen01() {
    return `
      <h2 class="screen-title">Welcome! Check your Personal Loan offer</h2>
      <div class="field-grid two">
        <div class="field">
          <span class="label">Mobile number</span>
          <input class="input" name="mobile" value="${escapeAttr(state.mobile)}" placeholder="+91 Enter Registered Mobile Number" />
          <span class="small">We will send an OTP on this number</span>
        </div>
        <div class="field">
          <span class="label">Select identity proof</span>
          <div class="radio-row">${radio("idMode", "PAN", "Pan Card")}${radio("idMode", "DOB", "Date of Birth")}</div>
          ${state.idMode === "PAN"
            ? `<input class="input" name="pan" type="text" inputmode="text" pattern="[A-Za-z0-9]*" maxlength="10" value="${escapeAttr(state.pan)}" placeholder="Enter PAN" />`
            : `<input class="input" name="dob" type="date" value="${escapeAttr(state.dob)}" />`
          }
        </div>
      </div>
      <div class="field-grid two" style="margin-top:24px">
        <div>
          <p>Are you a politician or a Politically exposed person(PEP)?</p>
          <div class="radio-row">${radio("pep", "Yes", "Yes")}${radio("pep", "No", "No")}</div>
          <p><a href="#">Who are PEPs?</a></p>
        </div>
        <div>
          <p>Your source of income</p>
          <div class="radio-row">${radio("incomeSource", "Salaried", "Salaried")}${radio("incomeSource", "Self Employed", "Self Employed / Professionals / Business")}</div>
          <div class="warning">Income verification or salary proof maybe required for processing loan request</div>
        </div>
      </div>
      <div style="margin-top:28px">
        ${check("consentLoan", "I hereby consent to collection and processing of my data for availing this loan and relevant services in the manner described in the notice.")}
        ${check("consentMarketing", "I hereby consent to processing of my Data for personalized offers on other products and services of HDHC Bank, its affiliates, and partners.")}
      </div>
      ${actions("View Loan Eligibility")}
    `;
  }

  function screen02() {
    return `
      <h2 class="screen-title">Ready for you</h2>
      <p class="lead">Help us confirm this is you!</p>
      <div class="panel flat">
        <p>Enter OTP sent as a 6-digit OTP to your registered mobile number <button class="secondary" type="button">Edit mobile number</button></p>
        <div class="otp-boxes">
          ${Array.from({ length: 6 }).map((_, i) => `<input class="input otp" name="otp${i}" maxlength="1" value="${escapeAttr((state.otp || "")[i] || "")}" inputmode="numeric" />`).join("")}
        </div>
        <p class="small">Resend OTP in 28 secs</p>
      </div>
      ${actions("Submit")}
    `;
  }

  function screen03() {
    return `
      <h2 class="screen-title">Please confirm, where does your latest salary get credited?</h2>
      <div class="button-row">
        <button class="select-option ${state.salaryAccountType === "HDHC Bank" ? "active" : ""}" type="button" data-set="salaryAccountType" data-value="HDHC Bank" aria-pressed="${state.salaryAccountType === "HDHC Bank"}">HDHC Bank</button>
        <button class="select-option ${state.salaryAccountType === "Other Bank" ? "active" : ""}" type="button" data-set="salaryAccountType" data-value="Other Bank" aria-pressed="${state.salaryAccountType === "Other Bank"}">Other Bank</button>
      </div>
      <div class="panel" style="margin-top:72px;text-align:center">
        <strong>Processing...</strong>
        <p class="small">Doing eligibility check instantly from individual documents, minor account and other sources.</p>
      </div>
      ${actions("Continue")}
    `;
  }

  function screen04() {
    return `
      <h1 class="screen-title">Please provide following details to process your application</h1>
      <div class="section-title">Personal details</div>
      <div class="panel">
        <div class="field"><span class="label">Your PAN</span><strong>${splitPan(state.pan)} verified</strong></div>
        <p><strong>Your full name (as per bank record)</strong></p>
        <div class="field-grid">${field("firstName", "First name")}${field("middleName", "Middle Name (as per PAN)")}${field("lastName", "Last name")}</div>
      </div>
      <div class="panel">
        <p><strong>Your gender</strong></p>
        <div class="radio-row">${radio("gender", "Male", "Male")}${radio("gender", "Female", "Female")}${radio("gender", "Gender Neutral", "Gender Neutral")}</div>
      </div>
      ${actions("Continue")}
    `;
  }

  function screen05() {
    return `
      <div class="field-grid two">
        ${field("email", "Your Personal Email Address", "email")}
        ${selectField("loanType", "Type of Loan", ["Personal Loan", "Balance Transfer", "Top-up"])}
      </div>
      <div class="panel" style="margin-top:28px">
        <div class="section-title">Address details</div>
        <div class="field">
          <label>Your current residential address (as per bank record)</label>
          <textarea class="textarea" name="address">${escapeHtml(state.address)}</textarea>
        </div>
        <div style="margin-top:16px">${check("changeAddress", "Change current residential address")}</div>
      </div>
      <div class="panel">
        <div class="section-title">Employment details</div>
        ${selectField("employer", "I am being assisted by HDHC Bank Employee", ["HDHC Bank Employee", "Branch Staff", "Call Center", "Relationship Manager"])}
      </div>
      ${actions("Continue")}
    `;
  }

  function screen06() {
    return `
      <h2 class="section-title">For banks use only</h2>
      <div class="panel flat">
        <div class="field-grid two">
          ${selectField("channel", "Channel", ["DSA", "Branch", "Digital", "Tele-calling"])}
          ${field("agentCode", "Agent Code / Broker ID")}
          ${field("smCode", "SM Code")}
          ${field("tmCode", "TE Code")}
          ${field("tlCode", "TL Code")}
          ${field("lcCode", "LC Code")}
          ${field("pin", "Sales/Phone Code")}
        </div>
      </div>
      ${actions("Continue")}
    `;
  }

  function screen07() {
    const banks = ["HDHC Bank", "Axis Bank", "Kotak Bank", "State Bank of India", "ICICI Bank", "Punjab National Bank", "IndusInd Bank", "Bank of Maharashtra"];
    return `
      <h2 class="screen-title">Please help us with your income</h2>
      <p><strong>Select the Bank Account where your SALARY is deposited</strong></p>
      <input class="input" name="bankSearch" placeholder="Search your bank" />
      <div class="account-grid" style="margin-top:16px">
        ${banks.map((bank) => `<button class="bank-option ${state.bank === bank ? "active" : ""}" type="button" data-set="bank" data-value="${bank}">${bank}</button>`).join("")}
      </div>
      <div class="button-row" style="margin-top:24px">${actions("Continue", true)}</div>
    `;
  }

  function screen08() {
    return incomeChoice(false);
  }

  function screen09() {
    return incomeChoice(true);
  }

  function incomeChoice(showUpload) {
    return `
      <h2 class="screen-title">E-Verify Income</h2>
      <p class="lead">Secure, Convenient, Faster</p>
      <div class="choice-card selected">
        <label><input type="radio" name="verificationMethod" value="mobileOtp" ${state.verificationMethod === "mobileOtp" ? "checked" : ""}>Verify with Mobile OTP</label>
        <span class="small">A super safe, secure and effective way to verify your income through mobile OTP and linked account aggregators.</span>
        <button class="cta" type="button" data-next>Continue with AA</button>
      </div>
      <div class="choice-card">
        <label><input type="radio" name="verificationMethod" value="netbanking" ${state.verificationMethod === "netbanking" ? "checked" : ""}>Verify with NetBanking</label>
        <span class="small">Log in to your net banking account to securely fetch income data.</span>
      </div>
      ${showUpload ? `<div class="choice-card"><label><input type="radio" name="verificationMethod" value="upload" ${state.verificationMethod === "upload" ? "checked" : ""}>Upload Bank Statements (PDF only)</label><input class="input" type="file" name="statement" accept="application/pdf"></div>` : ""}
      ${actions("Continue")}
    `;
  }

  function screen10() {
    return `
      <h2 class="screen-title">Hello, ${state.firstName} ${state.lastName}</h2>
      <p class="lead">It'll take just a few seconds to verify your income.</p>
      <div class="field-grid one">
        ${selectField("accountAggregator", "Select Account Aggregator", ["Finvu", "Onemoney", "CAMS Finserv", "Anumati"])}
        ${field("mobile", "Your Mobile Number", "tel")}
      </div>
      ${actions("Continue")}
    `;
  }

  function screen11() {
    return `
      <div class="field-grid two">
        <div>
          <h2 class="screen-title">HDHC Bank uses Finvu AA to receive your financial details securely</h2>
          <div class="otp-boxes">${Array.from({ length: 6 }).map((_, i) => `<input class="input otp" name="aaOtp${i}" maxlength="1" value="${escapeAttr((state.aaOtp || "")[i] || "")}">`).join("")}</div>
          <p class="toast">Secure OTP sent</p>
        </div>
        <div class="quick-steps">
          <h2>Share your Financial data instantly</h2>
          <ol>
            <li>Register on Finvu using an OTP sent to your mobile number.</li>
            <li>Discover and choose the accounts you want to share.</li>
            <li>Review and approve the consents to share your account information securely.</li>
          </ol>
        </div>
      </div>
      ${actions("Continue")}
    `;
  }

  function screen12() {
    return aaScreen("Verify Accounts", "Continue", `
      <div class="verify-box">
        ${radio("aaAccount", "Kotak Bank", "Kotak Bank")}
        <p class="small">Last four digits: 9999</p>
      </div>
      <div class="verify-box">
        ${radio("aaAccount", "Savings", "Savings")}
        <p class="small">Account discovered by Finvu</p>
      </div>
    `);
  }

  function screen13() {
    return aaScreen("Consent Requested", "Approve", consentTable());
  }

  function screen14() {
    return aaScreen("Consent Review", "Approve", consentTable());
  }

  function screen15() {
    return aaScreen("Consent Approval", "Approve", consentTable());
  }

  function aaScreen(title, button, inner) {
    return `
      <div class="aa-frame">
        <div class="aa-header"><strong>Finvu</strong><span>HDHC Bank</span></div>
        <h2>${title}</h2>
        ${inner}
      </div>
      ${actions(button)}
    `;
  }

  function consentTable() {
    return `
      <div class="consent-card">
        <p><strong>Consent Purpose</strong> To process loan from HDHC Bank including your approved and customized offers.</p>
        <div class="field-grid two">
          ${selectField("consentFrequency", "Data fetch frequency", ["One time", "Monthly", "Quarterly"])}
          ${selectField("consentDuration", "Consent duration", ["1 month", "3 months", "6 months"])}
        </div>
        <div class="verify-box">${radio("aaAccount", "Kotak Bank", "Kotak Bank account ending 9999")}</div>
      </div>
    `;
  }

  function screen16() {
    return offerScreen(false);
  }

  function screen17() {
    return offerScreen(true);
  }

  function offerScreen(showEmi) {
    const emi = calculateEmi(state.loanAmount, state.tenure);
    return `
      <h2 class="screen-title">Congratulations, ${state.firstName} ${state.lastName}</h2>
      <p class="toast">Your offer based on information available with us.</p>
      <div class="loan-card">
        <div class="loan-row">
          <h2>Loan Amount</h2>
          <input class="input" name="loanAmount" type="number" min="50000" max="880000" step="10000" value="${state.loanAmount}">
        </div>
        <input class="range" name="loanAmount" type="range" min="50000" max="880000" step="10000" value="${state.loanAmount}">
        <div class="button-row" style="justify-content:space-between"><span>50,000</span><span>8,80,000 (Max)</span></div>
      </div>
      <div class="loan-card">
        <div class="loan-row">
          <h2>Tenure</h2>
          <input class="input" name="tenure" type="number" min="12" max="60" step="12" value="${state.tenure}">
        </div>
        <input class="range" name="tenure" type="range" min="12" max="60" step="12" value="${state.tenure}">
      </div>
      ${showEmi ? `<div class="emi">Monthly Installment Rs ${formatIndian(emi)}<br><span class="small">Loan processing charges + GST Rs 4,129</span></div>` : ""}
      ${actions(showEmi ? "Get Loan >>" : "Continue")}
    `;
  }

  function screen18() {
    return `
      <h2 class="screen-title">Hi, ${state.firstName} ${state.lastName}</h2>
      <p><strong>Your residential address</strong></p>
      <textarea class="textarea" name="address">${escapeHtml(state.address)}</textarea>
      <div class="field-grid two" style="margin-top:18px">
        ${field("officeAddress1", "Your Office Address Line 1")}
        ${field("officeAddress2", "Your Office Address Line 2")}
        ${field("officeLandmark", "Office Address line 3 (Optional)")}
        ${field("city", "Pin Code of your office")}
        ${field("state", "City")}
        ${selectField("officeState", "State", ["Haryana", "Delhi", "Maharashtra", "Karnataka"])}
      </div>
      ${actions("Continue >>")}
    `;
  }

  function screen19() {
    return `
      <h2 class="screen-title">Last few steps to get your loan</h2>
      <div class="verify-box">
        <strong>Verify your Email ID</strong>
        ${field("personalEmail", "Personal Email ID", "email", "line")}
        ${field("workEmail", "Work Email ID", "email", "line")}
      </div>
      <div class="verify-box">
        <strong>Work Email ID</strong>
        <p class="small">Verify your work email address to skip manual verification and avoid delay in loan disbursal.</p>
        <button class="outline" type="button">Send OTP >></button>
      </div>
      <div class="verify-box">
        <strong>Kindly provide the details of your Salary Account</strong>
        <div class="field-grid two">${field("salaryMasked", "Your Salary Account Number", "text", "line")}${field("ifsc", "Your Bank IFSC code", "text", "line")}</div>
      </div>
      ${actions("Continue")}
    `;
  }

  function screen20() {
    return `
      <h2 class="screen-title">Last few steps to get your loan</h2>
      <div class="verify-box">
        <strong>Verify your Email ID</strong>
        ${field("personalEmail", "Personal Email ID", "email", "line")}
        ${field("workEmail", "Work Email ID", "email", "line")}
      </div>
      <div class="verify-box">
        <strong>Kindly provide the details of your Salary Account</strong>
        <div class="field-grid two">
          ${field("salaryMasked", "Your Salary Account Number", "text", "line")}
          ${field("ifsc", "Your Bank IFSC code", "text", "line")}
          ${field("salaryAccount", "Please enter your unmasked Account Number", "text", "line")}
          ${field("bankName", "Bank Name", "text", "line")}
          ${field("branchName", "Branch Name", "text", "line")}
        </div>
      </div>
      <div class="verify-box">
        <strong>Kindly provide details of someone who can serve as your reference</strong>
        <div class="field-grid two">${field("referenceName", "Reference's Name", "text", "line")}${field("referencePhone", "Reference's Contact Number", "tel", "line")}</div>
      </div>
      <div class="button-row"><button class="secondary" type="button" data-prev>Back</button><button class="cta" type="button" data-finish>Proceed >></button></div>
    `;
  }

  function actions(label, inline = false) {
    const html = `
      <div class="button-row" style="margin-top:28px">
        ${current > 0 ? `<button class="secondary" type="button" data-prev>Back</button>` : ""}
        <button class="cta" type="button" data-next>${label}</button>
      </div>
    `;
    return inline ? html.replace('<div class="button-row" style="margin-top:28px">', "").replace("</div>", "") : html;
  }

  function attachEvents() {
    document.querySelectorAll("[name]").forEach((el) => {
      el.addEventListener("input", updateFromElement);
      el.addEventListener("change", updateFromElement);
    });

    document.querySelectorAll("[data-step]").forEach((button) => {
      button.addEventListener("click", () => {
        current = Number(button.dataset.step);
        render();
      });
    });

    document.querySelectorAll("[data-set]").forEach((button) => {
      button.addEventListener("click", () => {
        state[button.dataset.set] = button.dataset.value;
        saveState();
        render();
      });
    });

    document.querySelectorAll("[data-next]").forEach((button) => {
      button.addEventListener("click", () => {
        collectOtp();
        current = Math.min(steps.length - 1, current + 1);
        saveState();
        render();
      });
    });

    document.querySelectorAll("[data-prev]").forEach((button) => {
      button.addEventListener("click", () => {
        current = Math.max(0, current - 1);
        saveState();
        render();
      });
    });

    document.querySelectorAll("[data-action='save']").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        collectOtp();
        saveForLater();
        setNotice("Saved for later in this browser.");
      });
    });

    document.querySelectorAll("[data-finish]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        collectOtp();
        setNotice("Application details captured in the simulator.");
      });
    });
  }

  function updateFromElement(event) {
    const el = event.target;
    if (el.type === "radio") {
      if (el.checked) state[el.name] = el.value;
      if (el.name === "idMode") {
        saveState();
        render();
        return;
      }
    } else if (el.type === "checkbox") {
      state[el.name] = el.checked;
    } else if (el.name.startsWith("otp") || el.name.startsWith("aaOtp")) {
      collectOtp();
    } else if (el.name === "loanAmount" || el.name === "tenure") {
      state[el.name] = Number(el.value);
      saveState();
      render();
      return;
    } else if (el.name === "pan") {
      el.value = el.value.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 10);
      state[el.name] = el.value;
    } else {
      state[el.name] = el.value;
    }
    saveState();
  }

  function collectOtp() {
    const otp = Array.from(document.querySelectorAll("[name^='otp']")).map((el) => el.value).join("");
    const aaOtp = Array.from(document.querySelectorAll("[name^='aaOtp']")).map((el) => el.value).join("");
    if (otp) state.otp = otp;
    if (aaOtp) state.aaOtp = aaOtp;
  }

  function calculateEmi(amount, months) {
    const monthly = .0999 / 12;
    const factor = Math.pow(1 + monthly, months);
    return Math.round((amount * monthly * factor) / (factor - 1));
  }

  function formatIndian(value) {
    return Number(value).toLocaleString("en-IN");
  }

  function splitPan(pan) {
    return String(pan || "").split("").join(" ");
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  render();
})();
