/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ContentAngleDecision {
  angle_decision_id: string;
  content_creation_plan_id: string;
  /**
   * @minItems 1
   * @maxItems 20
   */
  candidates:
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ]
    | [
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
        {
          candidate_id: string;
          angle_name: string;
          angle_code:
            | "RISK"
            | "COST"
            | "DECISION"
            | "MISCONCEPTION"
            | "DIAGNOSIS"
            | "COMPARISON"
            | "PROCESS"
            | "CASE"
            | "EMOTIONAL"
            | "PROFESSIONAL_JUDGMENT";
          premise: string;
          target_emotion_or_decision: string;
          subject_advantage_fit: string;
          evidence_coverage: string;
          content_value: string;
          expected_structure:
            | "PROBLEM_DECONSTRUCTION"
            | "CHECKLIST"
            | "MISCONCEPTION"
            | "CASE"
            | "STEPS"
            | "VIEWPOINT"
            | "COMPARISON"
            | "DIAGNOSIS"
            | "DECISION_GUIDANCE"
            | "STORY";
          duplication_risk: "LOW" | "MEDIUM" | "HIGH";
          /**
           * @minItems 1
           */
          strengths: [string, ...string[]];
          limitations: string[];
        },
      ];
  selected_candidate_id: string;
  selection_rationale: string;
  historical_angles: string[];
  recent_structure_usage: string[];
  user_fixed_angle: string | null;
  user_rejected_angles: string[];
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
