#!/usr/bin/env node
/**
 * Update specific slides in the case study deck without touching others.
 *
 * Usage: node scripts/google/update-slides.js --from 6
 */

const { google } = require("googleapis");
const { getAuthorizedClient } = require("./auth");

const DEFAULT_PRESENTATION_ID = "1vfJZFbxkxz-t7Eqg4jEbWDDPjHzmKTGCVDrbg5SMxPg";
const AUTHOR = 'Per "Pierre" Jørgensen';

const SLIDE_UPDATES = {
  6: {
    label: "2. Problem Framing",
    headline: "Early hypotheses to test",
    body: `H1 — Unit economics: Cost-to-serve is roughly flat per buyer; $25–50K segment is structurally less profitable unless the servicing model changes.
Invalidated if: data shows cost-to-serve scales meaningfully with buyer revenue.
H2 — Dispute/support: Rates per dollar of revenue will be 2–3× higher, driven by lower buyer-side AP maturity.
Invalidated if: comparable small-buyer cohorts show enterprise-like rates.
H3 — Credit loss: Losses per dollar of credit extended will be materially higher — thinner balance sheets, cyclical exposure.
Invalidated if: historical loss data from comparable small-buyer programs.
H4 — Segment composition: Target buyers are largely existing dealer relationships not yet on net terms — not net-new to Paccar.
Invalidated if: dealer data shows buyers are mostly net-new.
Layer note: economics/process change and config-vs-build are different bets — resolve both early.`,
  },
  7: {
    label: "3. Product & Platform Strategy",
    headline: "Real strategic options",
    body: `(a) Extend current platform as-is — accept margin compression and segment-level loss potential.
(b) Differentiated servicing tier within current platform — same UX, different SLAs, support model, and automation thresholds behind it.
(c) Lite buyer experience — simplified portal, defaults tuned for low-sophistication AP, preemptive dispute prevention.
(d) Decline or phase carefully — controlled cohort to validate economics before committing platform investment.
All four stay on the table until discovery closes gaps — none is a strawman.`,
  },
  8: {
    label: "3. Product & Platform Strategy",
    headline: "How I'd choose",
    body: `Criteria: Paccar time-to-value, incremental cost-to-serve, platform debt, impact on other clients, reversibility, horizontal replicability.
Process:
Discovery sprint with Finance — segment sizing, cohort benchmarks, cost-to-serve modeling.
Cross-functional scoring — eng, credit, compliance, CS, Account Management.
TRP precedent: same structural play — segment expansion to defend dealer economics vs. NAPA/FleetPride.
Key product bet: platform as buyer's de facto AP system — order capture, delivery confirmation, pre-invoice reconciliation to preempt disputes (real engineering cost; horizontal replication potential).
Decision gate: proceed to build, pilot only, or defer with conditions.`,
  },
  9: {
    label: "4. Trade-off Evaluation",
    headline: "Where the tensions are real",
    body: `Client speed ↔ platform integrity — feature parity pressure vs. shared patterns, not one-off forks.
Segment capture ↔ existing margin — growth on $25–50K vs. protecting $250K segment economics.
Segment investment ↔ platform optionality — Paccar SOM justifies; horizontal capability (KYB, tiered underwriting, lite onboarding) changes risk-adjusted return.
"Platform must support this" ↔ unit economics — frame as shared problem with Paccar, not TreviPay pushback.
Speed-to-market ↔ hypothesis-first discipline — Q3 pressure vs. validating economics before irreversible build.
Portfolio frame: invest when platform-level optionality is explicit.`,
  },
  10: {
    label: "5. Stakeholder Leadership",
    headline: "Who's at the table?",
    body: `Paccar exec sponsor — growth, timeline, narrative.
Paccar commercial / dealer-network leadership — sells and services.
Paccar parts / TRP leadership — channel data, competitive view.
TreviPay leadership / Sr. Director of Product — margin, platform strategy, resources.
Account Manager — TreviPay–Paccar relationship (not buyer support); this PM seat partners with AM.
Engineering / Platform — dedicated instance, shared roadmap.
Credit & Risk, Compliance / BSA-AML, Onboarding Ops, Support, Finance / RevOps.
Conflict zones: AM between Paccar urgency and internal capacity; platform vs. client-custom; risk vs. growth.`,
  },
  11: {
    label: "5. Stakeholder Leadership",
    headline: "How I'd align — and push back",
    body: `Co-author discovery agenda with Account Manager — one voice to Paccar.
Compliance and Credit/Risk first — constraints filter what's feasible before build debates.
Engineering early — assess config vs. build on dedicated instance.
Paccar: unit economics as shared problem; clarify what Q3 can mean (pilot scope vs. full launch).
TreviPay upward: portfolio frame — Paccar SOM + platform optionality; explicit bet with kill criteria.
Cadence: weekly core team, biweekly steering, monthly client checkpoint.
RSA Archer: enterprise client research with Walmart, UHC, Best Buy — translation muscle for this seat.`,
  },
  12: {
    label: "6. Execution & Success Metrics",
    headline: "Validate before you build",
    body: `First 30 days: SME relationships (Compliance + Credit/Risk first); comparable cohort data; validate unit-economics hypotheses; co-build discovery plan with AM.
Days 30–60: Segment composition via Paccar dealer data; cost-to-serve baseline; controlled-cohort pilot — real buyers, instrumented for dispute/loss/support.
Days 60–90: Pilot informs option a/b/c/d; joint recommendation to TreviPay leadership and Paccar.
Principle: validate riskiest hypotheses first — not maximum feature surface fastest.
Segment P&L tracked from day one.`,
  },
  13: {
    label: "6. Execution & Success Metrics",
    headline: "Metrics and kill criteria",
    body: `Leading: application completion, time to decision, KYB exception rate, onboarding cost/buyer, activation, time to first transaction, support contacts/buyer.
Lagging: cohort gross margin, dispute rate/invoice, dispute cycle time, credit loss, retention, buyer NPS, graduation to higher spend tiers.
Cohort separately from $250K segment — never blend.
Kill criteria (examples): cost-to-serve >X% of ACV at 90 days; loss rate exceeds model by Y; support load forces staffing step-change without revenue offset → scale back or stop.
Scale triggers: margin within target, repeatable dealer onboarding, platform changes confirmed reusable.`,
  },
  14: {
    label: "Closing",
    headline: "Where I land — tentatively",
    body: `Strategic question: Can TreviPay enable Paccar's expansion profitably — without compromising platform integrity or the enterprise segment?
Tentative POV: Proceed via controlled pilot + differentiated tier (not platform as-is) — unless discovery proves cost-to-serve closes within bounds. Invest where capability is horizontally replicable.
Pressure-test with you: segment data access, lite-tier appetite, Q3 flexibility, kill criteria agreement.
Open for discussion.`,
  },
};

function shapeText(element) {
  const parts = [];
  for (const te of element.shape?.text?.textElements || []) {
    if (te.textRun?.content) parts.push(te.textRun.content);
  }
  return parts.join("");
}

function classifySlideShapes(slide) {
  const shapes = { headline: null, section: null, body: null, footer: null };

  for (const element of slide.pageElements || []) {
    if (!element.shape?.text) continue;
    const text = shapeText(element);
    const type = element.shape.placeholder?.type;

    if (
      text.includes("Principal Product Manager Case Study") ||
      text.includes(AUTHOR)
    ) {
      shapes.footer = element.objectId;
    } else if (/^(\d+\.|Closing)/.test(text.trim())) {
      shapes.section = element.objectId;
    } else if (type === "TITLE" && !shapes.headline) {
      shapes.headline = element.objectId;
    } else if (type === "BODY" && !shapes.body) {
      shapes.body = element.objectId;
    }
  }

  return shapes;
}

function setShapeText(objectId, text) {
  return [
    { deleteText: { objectId, textRange: { type: "ALL" } } },
    { insertText: { objectId, insertionIndex: 0, text } },
  ];
}

function parseArgs() {
  const fromIndex = Number(process.argv[process.argv.indexOf("--from") + 1] || 6);
  const presentationId =
    process.argv.find((arg) => !arg.startsWith("-") && arg.includes("-")) ||
    DEFAULT_PRESENTATION_ID;
  return { fromIndex, presentationId: DEFAULT_PRESENTATION_ID };
}

async function main() {
  const { fromIndex, presentationId } = parseArgs();
  const auth = await getAuthorizedClient();
  const slidesApi = google.slides({ version: "v1", auth });

  const { data: presentation } = await slidesApi.presentations.get({
    presentationId,
  });

  const updateRequests = [];

  presentation.slides.forEach((slide, index) => {
    const slideNumber = index + 1;
    if (slideNumber < fromIndex) return;

    const content = SLIDE_UPDATES[slideNumber];
    if (!content) return;

    const shapes = classifySlideShapes(slide);
    if (!shapes.headline || !shapes.section || !shapes.body) {
      throw new Error(
        `Could not classify slide ${slideNumber} (${slide.objectId}): ${JSON.stringify(shapes)}`,
      );
    }

    updateRequests.push(
      ...setShapeText(shapes.section, `${content.label}\n`),
      ...setShapeText(shapes.headline, `${content.headline}\n`),
      ...setShapeText(shapes.body, `${content.body}\n`),
    );

    if (shapes.footer) {
      updateRequests.push(
        ...setShapeText(shapes.footer, `${AUTHOR} | ${slideNumber}\n`),
      );
    }
  });

  if (!updateRequests.length) {
    console.log("No slides to update.");
    return;
  }

  await slidesApi.presentations.batchUpdate({
    presentationId,
    requestBody: { requests: updateRequests },
  });

  const updatedNumbers = Object.keys(SLIDE_UPDATES)
    .map(Number)
    .filter((n) => n >= fromIndex);

  console.log("Updated slides:", updatedNumbers.join(", "));
  console.log(
    `Open: https://docs.google.com/presentation/d/${presentationId}/edit`,
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
