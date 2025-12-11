
import { GoogleGenAI, Type } from "@google/genai";
import { UserInputs, StudyPlan } from "../types";

export async function generateStudyPlan(inputs: UserInputs): Promise<StudyPlan> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Generate a highly personalized study plan based on the following information:
    - Syllabus Content: ${inputs.syllabus}
    - Exam Date: ${inputs.examDate}
    - Available Time: ${inputs.hoursPerDay} hours per day
    - Weak Areas: ${inputs.weakAreas}
    - Difficulty Preference: ${inputs.difficulty}

    The study plan should include:
    1. A roadmap of key milestones leading up to the exam.
    2. A structured daily timetable template.
    3. A spaced repetition revision schedule (Dates for 1st, 2nd, and 3rd revision for main topics).
    4. A high-level weekly summary.
    5. A motivational quote tailored to the student's difficulty level.
    6. Specific study strategies for their weak areas.
    7. Categorization of the syllabus topics.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  targetDate: { type: Type.STRING },
                  topics: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "description", "targetDate", "topics"]
              }
            },
            dailyTimetable: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  topic: { type: Type.STRING }
                },
                required: ["time", "activity"]
              }
            },
            revisionSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  date: { type: Type.STRING },
                  repetitionStage: { type: Type.NUMBER }
                },
                required: ["topic", "date", "repetitionStage"]
              }
            },
            weeklySummary: { type: Type.STRING },
            motivationalQuote: { type: Type.STRING },
            recommendedStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedCategories: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["roadmap", "dailyTimetable", "revisionSchedule", "weeklySummary", "motivationalQuote", "recommendedStrategies", "suggestedCategories"]
        }
      }
    });

    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr) as StudyPlan;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error("Failed to generate your personalized plan. Please check your API key and try again.");
  }
}
