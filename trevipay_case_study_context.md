# TreviPay Principal PM Case Study — Context for Cursor

## Purpose of this file

I'm preparing a take-home case study presentation for a Principal Product Manager panel interview at TreviPay. This file gives you the full strategic and substantive context developed across multiple prep conversations so you can help me build the slide deck without me having to re-explain the assignment, my background, or the analytical work already done.

The deliverable is a **20–25 minute presentation, ~12–14 slides**, delivered live to a panel. Target tool: Google Slides (or HTML if that turns out to be a better fit for what you produce — content is tool-agnostic).

---

## The role

**Principal Product Manager, TreviPay** — Overland Park, KS, hybrid.

- B2B payments and trade credit platform; 40+ year company, ~$8B annual transaction volume, 27 countries.
- The role is **account-specific to Paccar** (TreviPay's enterprise client — heavy-duty trucks: Kenworth, Peterbilt, DAF, plus TRP aftermarket parts brand).
- Leveled Principal **specifically** because the hiring director needs strong stakeholder-management skill to work effectively with the client and complement the Account Manager. It's a client-facing PM seat centered on managing a major enterprise account relationship — **not a bigger-product-surface seat.**
- Process so far: recruiter screen (Michele Adams) + Senior Director of Product Management interview, both with positive impressions. This take-home feeds the **panel interview**, the next stage.

---

## My background (relevant highlights)

- 20+ year **hybrid product designer/PM**, Pragmatic Institute certified.
- **Strongest credential for this client-facing seat**: RSA Archer (2017–2019) — owned primary on-site research with enterprise clients including Walmart, UnitedHealthcare, Best Buy. Translated enterprise-client needs into product decisions.
- Staples Promotional Products — multi-tenant B2B platform serving 200+ Fortune 500 clients; StaplesPromo.com 0-to-1; 116% conversion lift, 94% revenue YoY.
- Essense of Australia — first product design leader; multi-tenant, multi-language platform.
- Earlier: NIC (B2G payments/GovTech), Sprint (B2C/CRO), Garmin (data-dense fitness platform), UMB (consumer banking).

## Framing discipline (apply throughout the deck)

- **Surface gaps openly.** Don't overclaim, especially on payments-domain depth.
- **Name assumptions explicitly.** More credible than projecting false precision.
- **Lead with genuine client-facing PM credentials**, not platform-scale stories.
- **Form falsifiable hypotheses** rather than only asking questions. Pair each with what would invalidate it.
- **Don't delegate analytical synthesis to the client.** Paccar is a data source, not the analytical owner — this is a Principal-level posture.

---

## The assignment (verbatim core)

> Background: A mature B2B enterprise platform with multiple large clients. One strategically important client operates on a dedicated instance across multiple geographies (each geography a separate network with some shared platform capabilities and local operational differences). The client has historically served mid-sized and large customers averaging ~$250K annual spend. They now want to expand into a new segment of significantly smaller customers averaging $25K–$50K annual spend. They believe this represents meaningful growth potential and want the existing platform to support it. The current platform, workflows, and servicing model were designed around the existing customer base.

**The six sections to cover:**
1. Opportunity Assessment
2. Problem Framing (incl. early hypotheses)
3. Product & Platform Strategy
4. Trade-off Evaluation
5. Stakeholder Leadership
6. Execution & Success Metrics

**Section weighting (important):** Sections 5 and 6 carry the most weight for *this specific seat* because that's why the role was leveled Principal. Sections 1–4 are setup that earns the right to get there. Don't let the deck spend disproportionate time on fundamentals.

**The prompt is a thinly-veiled Paccar simulation** — dedicated instance, multiple geographies, expansion into a much smaller segment. Reason through this as Paccar specifically; don't keep it generic.

---

## Substantive material developed across prep

### Opportunity Assessment

**Market sizing — TAM/SAM/SOM framework applied to the Paccar expansion:**
- **TAM (top-down anchor):** ~$25–26B US heavy-duty truck aftermarket (IBISWorld / Grand View Research).
- **SAM:** Apply independent aftermarket channel share (~60%+) → roughly $15B.
- **SOM:** Requires Paccar-specific data — dealer footprint, channel reach, competitive incumbency. Won't have this in the take-home; name what's needed.
- **Critical structural distinction:** Keep SOM (demand-capture / competitive-win concept) separate from a fourth "**ramp-constrained obtainable**" layer covering execution capacity (KYB throughput, underwriting capacity, onboarding ops bandwidth). Don't fold operational constraints into SOM — it muddies the framework under panel pressure.
- **Platform-Level Obtainable Market (or "Horizontal Expansion Opportunity"):** A separate framing layer above Paccar's SOM — if TreviPay builds the capability to serve a long-tail buyer segment for Paccar, the underlying capability (KYB orchestration, tiered underwriting, configurable buyer onboarding) is horizontally replicable to other enterprise clients with similar "anchor plus long tail" network structures (industrial equipment, agriculture, building materials). Reframe: "investment justified by Paccar SOM, optionality created at the platform level."

**What additional information I'd need (explicit list for the deck):**
- Composition of the $25–50K segment (existing Paccar customers spending less vs. net-new buyers entirely)
- Paccar's strategic motive (offensive growth vs. defensive against NAPA/FleetPride encroachment)
- Cost-to-serve baseline by buyer size (hard costs + human-touch costs)
- Dispute and support rate data on comparable small-buyer cohorts (elsewhere on TreviPay platform)
- Credit loss data on smaller buyer cohorts
- Dealer-network readiness to sell and service smaller buyers
- KYB/AML processing throughput and capacity

**Internal SMEs I'd engage if hired** (good for the execution / first-90-days slide):
- Sales/AEs → win-rate, competitive incumbency
- Credit/Risk → approval rate baselines, underwriting throughput
- Compliance/BSA-AML → KYB capacity, processing time
- Implementation/Onboarding Ops → buyer throughput actuals
- Finance/RevOps → cohort/transaction data
- Paccar-side channel and parts sales leadership (via client relationship) → dealer footprint, competitive share loss
- **Sequencing principle:** Engage Compliance and Credit/Risk *early* to filter SAM by compliance eligibility *before* sizing SOM — more efficient than discovering compliance-ineligible sub-segments late.

### Problem Framing — key challenges

- **Cost-to-serve is roughly flat per buyer** (credit bureau pulls, KYB/AML screening, underwriter time, portal provisioning, support contact). A $200 onboarding cost is 0.08% of a $250K buyer's spend; the same $200 is 0.8% of a $25K buyer's spend — 10x the ratio.
- **Higher dispute and support burden per dollar of revenue from small buyers**, driven by structural conditions:
  - Less AP process maturity (no formal POs, no three-way matching, no AP team)
  - Pricing opacity (core charges, freight surcharges, tier pricing the buyer doesn't track)
  - Cash flow pressure changes behavior — disputing legitimately delays payment without going delinquent
  - More order-entry errors (parts fitment complexity, VIN-driven lookups)
  - Lower materiality threshold — $30 variances get flagged that enterprise buyers absorb
- **Credit risk models tuned on $250K-buyer data will misprice the new segment** — likely producing either over-conservative declines or under-priced approvals; thinner balance sheets and higher cyclical exposure.
- **Platform UX over-engineered for this segment** — parent/child hierarchies, EDI invoice delivery, SKU-level detail are unused by small buyers and may create cognitive friction, raising support contact rates.
- **Servicing SLAs designed for enterprise buyers may not be economically sustainable** at $25–50K average revenue per account.
- **Compliance is a non-negotiable floor.** AML/KYB requirements cannot be reduced to make the segment more profitable — they're regulatory, not product choices. Any "lower friction" strategy must find that friction reduction outside the compliance layer.
- **The "30-second credit decision" claim is real but narrow** — it covers automated decisioning happy-path only. Human touch and friction accumulate around it: application completion assistance, referred decisions (likely higher rate in this segment due to thinner credit files), AML false-positive review, document collection, terms agreement above thresholds, activation/education, edge-case escalations. These don't scale automatically.

### Early hypotheses (pick 3–4 for the deck, span categories, pair each with what would invalidate it)

- **H (unit economics):** Current cost-to-serve is roughly flat per buyer, making the $25–50K segment structurally less profitable per account unless the servicing model changes. *Invalidation:* data showing cost-to-serve scales meaningfully with buyer revenue.
- **H (dispute/support):** Dispute and support rates per dollar of revenue will be 2–3x higher for the new segment, driven by lower buyer-side AP maturity. *Invalidation:* TreviPay data on comparable small-buyer cohorts showing similar rates to enterprise.
- **H (credit loss):** Credit losses per dollar of credit extended will be materially higher in this segment due to thinner balance sheets and cyclical exposure. *Invalidation:* historical loss data from comparable small-buyer programs.
- **H (segment composition):** The segment is dominated by small-fleet operators (5–25 trucks), owner-operators with 2–4 trucks, independent repair shops, and small vocational operators — not net-new customer types Paccar doesn't currently touch. A significant share is buyers Paccar's dealer network already has commercial relationships with but isn't extending net terms to today. *Invalidation:* dealer relationship data showing the target buyers are largely net-new to Paccar.
- **H (platform fit):** Buyer portal UX is over-engineered for this segment; features will go unused while creating friction. *Invalidation:* usability research showing small buyers use or value enterprise features.
- **H (strategic motive):** Paccar's interest is partly defensive — protecting share against NAPA/FleetPride reaching down-market — as much as growth-driven. *Invalidation:* Paccar leadership framing the move as pure growth with no competitive pressure.
- **H (LTV):** This segment is a strategic on-ramp for buyers who may grow into the $250K segment over time; LTV calculation should reflect graduation rates, not just current ARPU. *Invalidation:* industry data showing low graduation rates.
- **H (client relationship):** Paccar's "platform must support this" framing may be flexible — open to a phased or alternative servicing model if unit economics case is made clearly. *Invalidation:* Paccar leadership signaling platform-as-is is a hard requirement.

**Note on H1/H2 tension:** If two hypotheses appear to contradict (e.g., "platform/process must change" vs. "config-only changes are sufficient"), they likely live at different layers — economics/operations vs. technical platform — and are complementary, not contradictory. If genuinely in tension, name the tension explicitly as a thing to resolve early. *That* framing is itself the Principal-level signal.

### Product & Platform Strategy — strategic options menu

Frame as real options, not strawmen:

- **(a)** Extend current platform as-is, accept margin compression and segment-level loss potential
- **(b)** Build differentiated servicing tier within current platform (different SLAs, support model, automation thresholds) — same UX, different operational model behind it
- **(c)** Build a "lite" buyer experience for this segment (simplified portal, defaults tuned for low-sophistication AP, preemptive dispute prevention)
- **(d)** Decline the expansion, or phase it carefully — start with a controlled cohort to validate economics before committing platform investment

**Key strategic insight to surface:** The platform can act as the buyer's de facto AP system for buyers who don't have one. Structured order capture at point of sale (SMS/email confirmation), delivery confirmation (signature/photo), pre-invoice reconciliation, buyer-side self-service matching in the portal — all *preempt* disputes rather than resolve them. This is a real product investment with real engineering cost, and it's the kind of strategic move that justifies a horizontal-replication argument across other TreviPay clients.

**TRP as direct precedent:** Paccar already made a buyer-segment-expansion decision when they launched the TRP aftermarket brand — capturing all-makes service customers, defending dealer economics, price-segmenting the maintenance buyer base, defending against NAPA/FleetPride. The case study's central question is structurally the same play, one layer up. Use TRP as a precedent reference point — it shows I understand Paccar's strategic history, not just the immediate request.

### Trade-off Evaluation — tensions to name

- Client request speed vs. platform integrity discipline
- Capturing the segment vs. protecting margin on the existing $250K segment
- Investment in segment-specific capabilities vs. platform-level optionality (the "horizontal expansion" frame helps resolve this in favor of investment)
- Honoring the "platform must support this" framing vs. pushing back on the unit economics
- Speed-to-market vs. validating the riskiest hypotheses first

### Stakeholder Leadership — the weighted section

**Stakeholder map:**
- Paccar executive sponsor (client-side)
- Paccar commercial / dealer-network leadership (will actually sell and service)
- Paccar parts / TRP leadership (channel data, competitive view)
- TreviPay leadership / Senior Director of Product
- **TreviPay Account Manager** — manages TreviPay's relationship with Paccar (the enterprise client), *not* individual buyers. Buyer proliferation is a client-perception burden on the AM, not a direct buyer-support bandwidth issue. **This PM seat partners with the AM** — that's the whole reason the role exists at Principal level.
- Engineering / Platform teams
- Credit & Risk
- Compliance / BSA-AML
- Implementation / Onboarding Ops
- Support / Collections
- Finance / RevOps

**How I'd align them:**
- Co-author the discovery agenda with the Account Manager so we go to Paccar with one voice
- Engage Compliance and Credit/Risk first — their constraints filter what's even feasible
- Bring engineering and platform leads in early to assess config-vs-build for any platform changes
- Manage Paccar's expectations by surfacing unit economics as a shared problem, not as TreviPay pushing back
- Manage upward at TreviPay by framing the work in portfolio terms — Paccar SOM justifies the investment, platform-level optionality changes the risk-adjusted return

**RSA Archer credential anchors this section** — direct enterprise client research with Walmart, UnitedHealthcare, Best Buy. The translation muscle for this seat is real and named.

### Execution & Success Metrics

**Execution approach (30/60/90 framing works well):**
- **First 30 days:** Build SME relationships (Compliance + Credit/Risk first), pull existing data on comparable cohorts, validate or invalidate the unit-economics hypotheses, co-build the discovery plan with the Account Manager.
- **Days 30–60:** Validate segment composition with Paccar dealer-network data, run cost-to-serve baseline, design a controlled-cohort pilot (real buyers, real loans, instrumented for dispute/loss/support data) rather than building broadly first.
- **Days 60–90:** Pilot lessons inform the platform/process decision (option a/b/c/d from above). Bring the recommendation back to TreviPay leadership and Paccar jointly.

**Success metrics — leading and lagging, with explicit kill criteria:**
- **Leading:** Application completion rate, time to decision, KYB exception rate, onboarding cost per buyer, buyer activation rate, time to first transaction, support contact rate per buyer
- **Lagging:** Cohort gross margin, dispute rate per invoice, dispute resolution cycle time, credit loss rate, retention/repeat purchase rate, buyer NPS, graduation rate to higher spend tiers
- **Cohort separately from the existing $250K segment** — never blend the data; the whole point is to know whether this segment works on its own terms
- **Kill criteria explicit:** If [specific metric] crosses [threshold] by [time], scale back or stop. Naming kill criteria signals Principal-level discipline.

---

## Slide structure (working target: 12–14 slides)

1. **Title** — assignment title, my name, "Prepared for TreviPay Principal PM Panel Interview," date. No contact info, no TreviPay logo (presumptuous; no brand guidelines).
2. **How I'm approaching this** *(optional)* — how I read the prompt, what I think the real strategic question is, how time is allocated across the six sections.
3. **Opportunity Assessment — evaluation framework** — TAM/SAM/SOM applied to Paccar; the four-layer structure (TAM → SAM → SOM → ramp-constrained obtainable); Platform-Level Obtainable Market as the second-order opportunity.
4. **Opportunity Assessment — what I'd need to know** — explicit list of additional information; internal SMEs by function; sequencing principle (Compliance first to filter SAM).
5. **Problem Framing — key challenges** — cost-to-serve, dispute scaling, credit model fit, platform over-engineering, servicing SLA economics, compliance as floor, "30-second" claim reframed.
6. **Problem Framing — early hypotheses** — 3–4 hypotheses spanning categories, each with invalidation criteria.
7. **Strategy — the options menu** — (a)–(d) above, framed as real options.
8. **Strategy — how I'd determine the optimal approach** — criteria, validation process, the TRP precedent reference, the "platform as buyer's de facto AP system" insight if it fits.
9. **Trade-offs** — tensions named explicitly; the portfolio-level frame (Paccar SOM + platform optionality).
10. **Stakeholder Leadership — the map and the alignment approach** — who's involved, where the conflicts are, partnership with the Account Manager. *(May split into 2 slides.)*
11. **Stakeholder Leadership — managing client and leadership expectations** — Paccar-side and TreviPay-side; cadence and communication.
12. **Execution — 30/60/90** — phasing, validating riskiest hypotheses first, controlled-cohort pilot before broad build.
13. **Success metrics & kill criteria** — leading + lagging; cohorting separately; explicit kill criteria.
14. **Closing** — strategic question as I see it, tentative point of view, invitation to discuss. Don't try to "wrap up" performatively.

---

## Visual / branding direction

- **No TreviPay logo or branding.** Don't borrow their visual identity; don't have access to their brand guidelines; risks looking like a rough approximation.
- **Footer:** my name + slide number. Consistent across slides.
- **Slide density:** short headlines, evidence or framework underneath, not paragraphs. Panel will read ahead on dense slides and stop listening.
- **Single point of view per slide.** If a slide is making two arguments, split or cut.
- **No heavy animation, no cinematic transitions.** Understated and well-organized beats flashy for this audience. Performance-over-substance reads badly.
- **Export to PDF as fallback** regardless of build tool — removes screen-share / format compatibility risk.

## Voice notes

- **Direct, structured, confident.** Not salesy.
- **Honest framing throughout.** "I don't have data on X, but the methodology I'd use is Y."
- **Land a point of view by the end.** Tentative is fine; neutral "it depends" is not.
- **Tie back to the broader strategic narrative.** No isolated answers.

---

## What I want from Cursor

Draft slide content (titles, body, speaker notes where useful) consistent with the structure, substance, framing discipline, and voice above. Treat the substantive material as authoritative — don't invent new analytical content. Where a slide needs a visual element (a 2x2, a map, a funnel, a timeline), describe it clearly enough that I can build it.
