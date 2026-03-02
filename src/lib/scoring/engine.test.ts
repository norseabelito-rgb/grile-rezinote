import { describe, it, expect } from "vitest"
import { scoreCS, scoreCM, scoreQuestion, calculateExamScore } from "./engine"
import type { QuestionScore } from "./types"

describe("scoreCS - Complement Simplu", () => {
  it("returns 4 for correct single answer", () => {
    expect(scoreCS(["A"], ["A"])).toBe(4)
  })

  it("returns 0 for wrong single answer", () => {
    expect(scoreCS(["B"], ["A"])).toBe(0)
  })

  it("returns 0 for empty selection", () => {
    expect(scoreCS([], ["A"])).toBe(0)
  })

  it("returns 0 for multiple selections (invalid for CS)", () => {
    expect(scoreCS(["A", "B"], ["A"])).toBe(0)
  })

  it("returns 4 when correct answer is not A", () => {
    expect(scoreCS(["D"], ["D"])).toBe(4)
  })
})

describe("scoreCM - Complement Multiplu", () => {
  // Standard cases
  it("returns 5 for all options correctly handled (2 correct: A, C)", () => {
    // Correct: A, C. Student selects: A, C
    // A: correct+selected=1, B: incorrect+unselected=1, C: correct+selected=1, D: incorrect+unselected=1, E: incorrect+unselected=1
    expect(scoreCM(["A", "C"], ["A", "C"])).toBe(5)
  })

  it("returns partial credit (3 pts) for partial match", () => {
    // Correct: A, C. Student selects: A, B
    // A: correct+selected=1, B: incorrect+selected=0, C: correct+unselected=0, D: incorrect+unselected=1, E: incorrect+unselected=1
    expect(scoreCM(["A", "B"], ["A", "C"])).toBe(3)
  })

  it("returns 5 for 3 correct answers all selected", () => {
    // Correct: A, B, D. Student selects: A, B, D
    // A:1, B:1, C: incorrect+unselected=1, D:1, E: incorrect+unselected=1 = 5
    expect(scoreCM(["A", "B", "D"], ["A", "B", "D"])).toBe(5)
  })

  it("returns 5 for 4 correct answers all selected", () => {
    // Correct: A, B, C, D. Student selects: A, B, C, D
    // A:1, B:1, C:1, D:1, E: incorrect+unselected=1 = 5
    expect(scoreCM(["A", "B", "C", "D"], ["A", "B", "C", "D"])).toBe(5)
  })

  it("returns partial credit when some correct missed", () => {
    // Correct: A, B, D. Student selects: A, B (missed D)
    // A:1, B:1, C: incorrect+unselected=1, D: correct+unselected=0, E: incorrect+unselected=1 = 4
    expect(scoreCM(["A", "B"], ["A", "B", "D"])).toBe(4)
  })

  it("returns 0 when all wrong selected (2 selections, both wrong)", () => {
    // Correct: A, C. Student selects: B, D
    // A: correct+unselected=0, B: incorrect+selected=0, C: correct+unselected=0, D: incorrect+selected=0, E: incorrect+unselected=1
    expect(scoreCM(["B", "D"], ["A", "C"])).toBe(1)
  })

  // Annulment cases
  it("returns 0 (annulment) for fewer than 2 selections", () => {
    expect(scoreCM(["A"], ["A", "C"])).toBe(0)
  })

  it("returns 0 (annulment) for empty selection", () => {
    expect(scoreCM([], ["A", "C"])).toBe(0)
  })

  it("returns 0 (annulment) for more than 4 selections", () => {
    expect(scoreCM(["A", "B", "C", "D", "E"], ["A", "C"])).toBe(0)
  })

  // Boundary cases
  it("accepts exactly 2 selections (minimum valid)", () => {
    const result = scoreCM(["A", "C"], ["A", "C"])
    expect(result).toBeGreaterThan(0) // Not annulled
  })

  it("accepts exactly 4 selections", () => {
    // Correct: A, B, C, D. Student selects: A, B, C, D
    const result = scoreCM(["A", "B", "C", "D"], ["A", "B", "C", "D"])
    expect(result).toBe(5)
  })

  it("handles custom allOptions parameter", () => {
    const result = scoreCM(["X", "Y"], ["X", "Y"], ["X", "Y", "Z"])
    // X: correct+selected=1, Y: correct+selected=1, Z: incorrect+unselected=1 = 3
    expect(result).toBe(3)
  })
})

describe("scoreQuestion", () => {
  it("delegates CS to scoreCS", () => {
    const result = scoreQuestion("CS", "q1", ["A"], ["A"])
    expect(result.score).toBe(4)
    expect(result.maxScore).toBe(4)
    expect(result.type).toBe("CS")
    expect(result.isAnnulled).toBe(false)
  })

  it("delegates CM to scoreCM", () => {
    const result = scoreQuestion("CM", "q2", ["A", "C"], ["A", "C"])
    expect(result.score).toBe(5)
    expect(result.maxScore).toBe(5)
    expect(result.type).toBe("CM")
    expect(result.isAnnulled).toBe(false)
  })

  it("marks CM as annulled when selections < 2", () => {
    const result = scoreQuestion("CM", "q3", ["A"], ["A", "C"])
    expect(result.score).toBe(0)
    expect(result.isAnnulled).toBe(true)
  })
})

describe("calculateExamScore", () => {
  it("calculates perfect exam score: 950", () => {
    const csScores: QuestionScore[] = Array.from({ length: 50 }, (_, i) => ({
      questionId: `cs-${i}`,
      type: "CS" as const,
      score: 4,
      maxScore: 4,
      isAnnulled: false,
    }))
    const cmScores: QuestionScore[] = Array.from({ length: 150 }, (_, i) => ({
      questionId: `cm-${i}`,
      type: "CM" as const,
      score: 5,
      maxScore: 5,
      isAnnulled: false,
    }))

    const result = calculateExamScore([...csScores, ...cmScores])
    expect(result.total).toBe(950)
    expect(result.maxPossible).toBe(950)
    expect(result.percentage).toBe(100)
    expect(result.csScore).toBe(200)
    expect(result.cmScore).toBe(750)
    expect(result.csCount).toBe(50)
    expect(result.cmCount).toBe(150)
  })

  it("calculates zero exam score", () => {
    const scores: QuestionScore[] = Array.from({ length: 200 }, (_, i) => ({
      questionId: `q-${i}`,
      type: i < 50 ? ("CS" as const) : ("CM" as const),
      score: 0,
      maxScore: i < 50 ? 4 : 5,
      isAnnulled: i >= 50,
    }))

    const result = calculateExamScore(scores)
    expect(result.total).toBe(0)
    expect(result.percentage).toBe(0)
  })

  it("calculates partial exam score correctly", () => {
    const scores: QuestionScore[] = [
      { questionId: "cs1", type: "CS", score: 4, maxScore: 4, isAnnulled: false },
      { questionId: "cs2", type: "CS", score: 0, maxScore: 4, isAnnulled: false },
      { questionId: "cm1", type: "CM", score: 5, maxScore: 5, isAnnulled: false },
      { questionId: "cm2", type: "CM", score: 3, maxScore: 5, isAnnulled: false },
      { questionId: "cm3", type: "CM", score: 0, maxScore: 5, isAnnulled: true },
    ]

    const result = calculateExamScore(scores)
    expect(result.total).toBe(12) // 4 + 0 + 5 + 3 + 0
    expect(result.csScore).toBe(4)
    expect(result.cmScore).toBe(8)
    expect(result.csCount).toBe(2)
    expect(result.cmCount).toBe(3)
  })
})
