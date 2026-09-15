#!/usr/bin/env node
/**
 * Build the TreviPay Principal PM case study deck.
 *
 * Usage: node scripts/google/build-case-study.js [presentationId]
 */

const { google } = require("googleapis");
const { getAuthorizedClient } = require("./auth");

const DEFAULT_PRESENTATION_ID = "1vfJZFbxkxz-t7Eqg4jEbWDDPjHzmKTGCVDrbg5SMxPg";
const TITLE_SLIDE_ID = "p";
const TEMPLATE_SLIDE_ID = "g3f242387162_0_47";
const FOOTER =
  'Principal Product Manager Case Study: Expansion into a New Customer Segment | Per "Pierre" Jorgensen';
const INTERVIEW_DATE = "June 25, 2026";

const CONTENT_SLIDES = [
  {
    label: "2. How I'm approaching this",
    headline: "What's the real question?",
    body: `Surface question: Should TreviPay enable Paccar's downmarket expansion?
Strategic question: Can we serve $25–50K ACV customers without breaking unit economics, platform integrity, or the enterprise model that funds the business?
Structure: Six sections from the prompt — weighted toward stakeholder leadership and execution discipline (~20 min).
Assumption: Paccar is the strategic client on a dedicated multi-geo instance; segment economics and cost-to-serve are the deciding variables.`,
  },
  {
    label: "3. Opportunity Assessment",
    headline: "Is this segment worth pursuing?",
    body: `Evaluation frame — not just TAM, but profitable expansion:
TAM → SAM → SOM by geo/network; size the $25–50K cohort Paccar can actually reach.
Revenue upside vs. margin: at 5–10× lower ACV, does volume compensate?
Cost to serve (likely breaker): onboarding, support, disputes, credit ops, implementation — fixed costs don't scale down linearly.
Strategic vs. financial: Paccar's influence may make this necessary even if SOM alone wouldn't justify it.
Decision threshold: segment P&L modeled separately; compare to enterprise baseline.`,
  },
  {
    label: "3. Opportunity Assessment",
    headline: "What do I still need to know?",
    body: `Segment composition: fleet size, credit profile, dispute propensity vs. current $250K cohort.
Comparable cohort data: loss rates, support tickets, churn on any existing smaller accounts.
Paccar's motive: growth narrative, competitive pressure, dealer-network economics — and how committed they are.
Geo variance: which networks launch first; local ops differences on the dedicated instance.
Dealer/channel readiness: can they sell and onboard without high-touch TreviPay involvement?
Volume and ramp assumptions: realistic customer count, not just addressable market.
Internal capacity: eng, credit/risk, support — what we'd redirect from platform roadmap.`,
  },
  {
    label: "4. Problem Framing",
    headline: "What could break?",
    body: `Cost-to-serve at $25–50K ACV: same workflows = margin compression or unsustainable CS load.
Dispute and support scaling: smaller customers may have higher touch-per-dollar if platform isn't simplified.
Credit risk model fit: enterprise underwriting may over- or under-price this segment.
Platform UX: workflows built for complex enterprise buyers over-serve simpler needs — or fail them silently.
Sales and servicing motion: enterprise AM model won't scale; self-serve vs. dealer-mediated is unresolved.
Multi-geo complexity: shared platform capabilities vs. local ops on dedicated instance compounds change cost.`,
  },
  {
    label: "4. Problem Framing",
    headline: "Early hypotheses to test",
    body: `H1 — Unit economics work only with a differentiated low-touch tier.
Invalidated if: pilot cost-to-serve exceeds enterprise-adjusted margin.
H2 — Current platform can serve segment with config, not code.
Invalidated if: >2 geo networks need bespoke workflow changes.
H3 — Segment is credit-homogeneous enough for existing risk models.
Invalidated if: loss rates exceed threshold in first 90-day cohort.
H4 — Paccar expansion is strategically necessary for the TreviPay relationship.
Invalidated if: leadership deprioritizes vs. multi-client platform bets.`,
  },
  {
    label: "5. Product & Platform Strategy",
    headline: "Real strategic options",
    body: `(a) Extend current platform as-is — fastest for Paccar, highest cost-to-serve and margin risk.
(b) Differentiated servicing tier within current platform — segment-specific workflows, shared core.
(c) "Lite" experience — simplified UX, reduced feature set, distinct onboarding/credit policies.
(d) Decline or phased no — honest if economics don't close; or limited pilot with explicit kill criteria.
All four stay on the table until discovery closes gaps — none is a strawman.`,
  },
  {
    label: "5. Product & Platform Strategy",
    headline: "How I'd choose",
    body: `Criteria: time-to-value for Paccar, incremental cost-to-serve, platform/architecture debt, impact on other clients, reversibility.
Process:
Discovery sprint (3–4 weeks): segment sizing, cohort benchmarks, cost-to-serve modeling with Finance.
Option scoring with cross-functional input — eng, credit, CS, Account Management.
Pilot design before platform commit: one geo, bounded cohort, lite tier or config-only MVP.
Executive recommendation with explicit trade-offs — not a single answer without data.
Decision gate: proceed to build, proceed to pilot only, or defer with conditions.`,
  },
  {
    label: "6. Trade-off Evaluation",
    headline: "Where the tensions are real",
    body: `Client opportunity ↔ platform integrity
Paccar wants speed and feature parity; platform team needs shared patterns, not one-off forks.
Business economics ↔ relationship strategy
Short-term revenue from Paccar expansion vs. margin erosion across segment.
Speed ↔ learning discipline
Q3 pressure vs. validating riskiest hypotheses first.
Resolution principle: segment-specific where economics require it; platform-shared where scale requires it — document the line.`,
  },
  {
    label: "7. Stakeholder Leadership",
    headline: "Who's at the table?",
    body: `Paccar exec sponsor — growth outcome, timeline, market narrative.
Paccar commercial/dealer leadership — channel motion, onboarding capacity.
TreviPay leadership — margin, platform strategy, resource allocation.
Account Manager — relationship broker; critical partner for expectation management.
Engineering — dedicated instance complexity, shared roadmap impact.
Credit/risk, compliance, support — cost-to-serve and policy fit for new segment.
Conflict zones: AM caught between Paccar urgency and internal capacity; platform vs. client-custom; risk vs. growth.`,
  },
  {
    label: "7. Stakeholder Leadership",
    headline: "How I'd align — and push back",
    body: `Account Manager partnership: single narrative to Paccar — "committed to the opportunity, disciplined on path"; joint client conversations, not parallel promises.
Manage "Q3" pressure: clarify what Q3 can mean (pilot scope, learning goals) vs. full platform launch.
Upward at TreviPay: frame as explicit bet with trade-offs, requested resources, and kill criteria.
Cross-functional rhythm: weekly core team, biweekly steering with leadership, monthly client checkpoint.
Principle: align on principles and gates before debating dates.`,
  },
  {
    label: "8. Execution & Success Metrics",
    headline: "Validate before you build",
    body: `Phase 0 (30 days): close information gaps — cohort data, cost-to-serve model, geo selection, stakeholder charter.
Phase 1 (60 days): bounded pilot — one network, capped cohort, lite tier or config-only MVP.
Phase 2 (90 days): evaluate against gates — scale, iterate, or stop.
Work structure: cross-functional squad with clear DRI; segment P&L tracked from day one.
Honest priority: learn whether economics and platform fit work — not ship maximum feature surface fastest.`,
  },
  {
    label: "8. Execution & Success Metrics",
    headline: "How we'd know — and when we'd stop",
    body: `Leading: pilot conversion, time-to-live, support tickets/account, dispute rate, credit approval throughput.
Lagging: segment gross margin, net revenue retention, loss rates, NPS/CSAT by cohort.
Tracked separately from enterprise — never blend segment economics into headline KPIs.
Kill criteria (examples): cost-to-serve >X% of ACV at 90 days; loss rate exceeds model by Y%; support load triggers staffing step-change without revenue offset.
Scale triggers: margin within target, repeatable dealer onboarding, platform changes confirmed reusable.`,
  },
  {
    label: "Closing",
    headline: "Where I land — tentatively",
    body: `The strategic question: not "can Paccar expand?" but "can TreviPay enable that expansion profitably without compromising the platform?"
Tentative POV: pursue via bounded pilot and differentiated tier — not full platform as-is — unless discovery proves cost-to-serve closes within acceptable bounds.
I'd want to pressure-test that with you: segment data access, internal appetite for lite-tier investment, and how hard the Q3 date really is.
Open for discussion.`,
  },
];

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

    if (text.includes("Principal Product Manager Case Study")) {
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

function setShapeText(objectId, text, { clear = true } = {}) {
  if (!clear) {
    return [{ insertText: { objectId, insertionIndex: 0, text } }];
  }
  return [
    { deleteText: { objectId, textRange: { type: "ALL" } } },
    { insertText: { objectId, insertionIndex: 0, text } },
  ];
}

async function resetContentSlides(slidesApi, presentationId) {
  const { data } = await slidesApi.presentations.get({ presentationId });
  const deleteIds = data.slides
    .map((slide) => slide.objectId)
    .filter((id) => id !== TITLE_SLIDE_ID && id !== TEMPLATE_SLIDE_ID);

  if (!deleteIds.length) return;

  await slidesApi.presentations.batchUpdate({
    presentationId,
    requestBody: {
      requests: deleteIds.map((objectId) => ({ deleteObject: { objectId } })),
    },
  });
}

async function ensureContentSlideCount(slidesApi, presentationId, count) {
  const { data } = await slidesApi.presentations.get({ presentationId });
  let contentSlides = data.slides.filter(
    (slide) => slide.objectId !== TITLE_SLIDE_ID,
  );

  while (contentSlides.length < count) {
    const newId = `content_slide_${contentSlides.length + 1}`;
    await slidesApi.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests: [
          {
            duplicateObject: {
              objectId: TEMPLATE_SLIDE_ID,
              objectIds: { [TEMPLATE_SLIDE_ID]: newId },
            },
          },
        ],
      },
    });
    const { data: refreshed } = await slidesApi.presentations.get({
      presentationId,
    });
    contentSlides = refreshed.slides.filter(
      (slide) => slide.objectId !== TITLE_SLIDE_ID,
    );
  }

  if (contentSlides.length > count) {
    const extras = contentSlides.slice(count).map((slide) => slide.objectId);
    await slidesApi.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests: extras.map((objectId) => ({ deleteObject: { objectId } })),
      },
    });
    contentSlides = contentSlides.slice(0, count);
  }

  return contentSlides.map((slide) => slide.objectId);
}

async function reorderContentSlides(slidesApi, presentationId, contentSlideIds) {
  for (let i = 0; i < contentSlideIds.length; i++) {
    await slidesApi.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests: [
          {
            updateSlidesPosition: {
              slideObjectIds: [contentSlideIds[i]],
              insertionIndex: 1 + i,
            },
          },
        ],
      },
    });
  }
}

async function main() {
  const presentationId = process.argv[2] || DEFAULT_PRESENTATION_ID;
  const auth = await getAuthorizedClient();
  const slidesApi = google.slides({ version: "v1", auth });

  await resetContentSlides(slidesApi, presentationId);

  const contentSlideIds = await ensureContentSlideCount(
    slidesApi,
    presentationId,
    CONTENT_SLIDES.length,
  );

  await reorderContentSlides(slidesApi, presentationId, contentSlideIds);

  const titleRequests = [
    ...setShapeText(
      "i0",
      "Principal Product Manager Case Study:\nExpansion into a New Customer Segment",
      { clear: true },
    ),
    ...setShapeText(
      "i1",
      `Per "Pierre" Jørgensen\nPrepared for TreviPay Principal PM Panel Interview\n${INTERVIEW_DATE}`,
      { clear: true },
    ),
  ];

  const { data: presentation } = await slidesApi.presentations.get({
    presentationId,
  });

  const orderedContentSlides = presentation.slides.filter(
    (slide) => slide.objectId !== TITLE_SLIDE_ID,
  );

  if (orderedContentSlides.length !== CONTENT_SLIDES.length) {
    throw new Error(
      `Expected ${CONTENT_SLIDES.length} content slides, found ${orderedContentSlides.length}`,
    );
  }

  const updateRequests = [...titleRequests];

  CONTENT_SLIDES.forEach((slideContent, index) => {
    const slide = orderedContentSlides[index];
    const shapes = classifySlideShapes(slide);

    if (!shapes.headline || !shapes.section || !shapes.body) {
      throw new Error(
        `Could not classify shapes on slide ${index + 2}: ${JSON.stringify(shapes)}`,
      );
    }

    updateRequests.push(
      ...setShapeText(shapes.section, `${slideContent.label}\n`),
      ...setShapeText(shapes.headline, `${slideContent.headline}\n`),
      ...setShapeText(shapes.body, `${slideContent.body}\n`),
    );

    if (shapes.footer) {
      updateRequests.push(...setShapeText(shapes.footer, `${FOOTER}\n`));
    }
  });

  await slidesApi.presentations.batchUpdate({
    presentationId,
    requestBody: { requests: updateRequests },
  });

  console.log("Deck updated.");
  console.log(
    `Open: https://docs.google.com/presentation/d/${presentationId}/edit`,
  );
  console.log(
    `Slides: ${CONTENT_SLIDES.length + 1} (title + ${CONTENT_SLIDES.length} content)`,
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
