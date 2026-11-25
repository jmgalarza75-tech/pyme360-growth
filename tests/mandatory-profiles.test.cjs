const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const jsPath = path.join(__dirname, "..", "assets", "indice-pyme360.js");
const js = fs.readFileSync(jsPath, "utf8");

// Extraer pyme360GetBrandRecommendation de assets/indice-pyme360.js
function extractBrandEngine() {
  const funcMatch = js.match(/function pyme360GetBrandRecommendation\([\s\S]*?\n  \}/);
  if (!funcMatch) throw new Error("pyme360GetBrandRecommendation function not found in JS");
  const fnCode = funcMatch[0];
  const factory = new Function(`${fnCode}; return pyme360GetBrandRecommendation;`);
  return factory();
}

const getBrandRecommendation = extractBrandEngine();

test("5 Mandatory Profiles Simulation", async (t) => {
  // Simulación de cálculo de pilares con soporte para 'na'
  function calculatePillars(answers) {
    const pNames = {
      p1: "Producto", p2: "Precio", p3: "Plaza (Canales)", p4: "Promoción",
      p5: "Personas", p6: "Procesos", p7: "Evidencia física y digital"
    };

    function calcPillarScore(qIndices) {
      const valid = qIndices
        .map((q) => answers[q])
        .filter((val) => typeof val === "number" && !isNaN(val));
      if (valid.length === 0) return null;
      return Math.round((valid.reduce((acc, v) => acc + v, 0) / valid.length) * 10) / 10;
    }

    const rawScores = [
      { key: "p1", name: pNames.p1, score: calcPillarScore([1, 2, 3]) },
      { key: "p2", name: pNames.p2, score: calcPillarScore([4, 5, 6]) },
      { key: "p3", name: pNames.p3, score: calcPillarScore([7, 8, 9]) },
      { key: "p4", name: pNames.p4, score: calcPillarScore([10, 11, 12]) },
      { key: "p5", name: pNames.p5, score: calcPillarScore([13, 14, 15]) },
      { key: "p6", name: pNames.p6, score: calcPillarScore([16, 17, 18]) },
      { key: "p7", name: pNames.p7, score: calcPillarScore([19, 20, 21]) }
    ];

    const validPillars = rawScores.filter((p) => p.score !== null);
    const overallAvg = validPillars.length > 0
      ? (validPillars.reduce((a, b) => a + b.score, 0) / validPillars.length)
      : 6.0;

    const pScores = rawScores.map((p) => ({
      key: p.key,
      name: p.name,
      score: p.score !== null ? p.score : Math.round(overallAvg * 10) / 10
    }));

    const finalAvg = pScores.reduce((sum, p) => sum + p.score, 0) / 7;
    const globalScore100 = Math.min(100, Math.max(10, Math.round(finalAvg * 10)));
    return { pScores, globalScore100, globalScore10: finalAvg.toFixed(1) };
  }

  await t.test("Perfil 1: Vivienda vacacional con problemas de comercialización", () => {
    const profile = {
      tipo: "vivienda",
      selectedNeeds: ["A", "C"],
      primaryNeed: "A",
      location: "Alicante",
      answers: {
        1: 7, 2: 6, 3: 8,
        4: 5, 5: 4, 6: 4,
        7: 4, 8: 4, 9: 3,  // Canales flojos
        10: 3, 11: 3, 12: 4, // Promoción floja
        13: "na", 14: 7, 15: 6, // Q13 es N/A porque es vivienda unifamiliar sin equipo
        16: 5, 17: 4, 18: 7,
        19: 7, 20: 6, 21: 8
      }
    };

    const { pScores, globalScore100 } = calculatePillars(profile.answers);
    const rec = getBrandRecommendation(profile.primaryNeed, pScores, profile.location, profile.tipo, profile.selectedNeeds);

    assert.equal(rec.brand, "PYME360", "Debe recomendar PYME360");
    assert.ok(globalScore100 >= 10 && globalScore100 <= 100, "Puntuación en rango válido");
    assert.ok(rec.title.length > 0, "Debe tener título de recomendación");
    assert.ok(rec.nextStep.length > 0, "Debe tener próximo paso");
  });

  await t.test("Perfil 2: Gestor de apartamentos que quiere mejorar su web", () => {
    const profile = {
      tipo: "apartamento",
      selectedNeeds: ["B", "D"],
      primaryNeed: "B",
      location: "Valencia",
      answers: {
        1: 8, 2: 7, 3: 7,
        4: 7, 5: 6, 6: 5,
        7: 8, 8: 7, 9: 3,  // Web floja
        10: 6, 11: 5, 12: 6,
        13: 7, 14: 8, 15: 7,
        16: 5, 17: 6, 18: 8,
        19: 5, 20: 4, 21: 6 // Evidencia visual mejorable
      }
    };

    const { pScores, globalScore100 } = calculatePillars(profile.answers);
    const rec = getBrandRecommendation(profile.primaryNeed, pScores, profile.location, profile.tipo, profile.selectedNeeds);

    assert.equal(rec.brand, "PYME360", "Debe recomendar PYME360");
    assert.match(rec.nextStep, /página web/i, "El próximo paso debe orientarse a web");
  });

  await t.test("Perfil 3: Propietario de casa rural que desea delegar la gestión", () => {
    const profile = {
      tipo: "casa_rural",
      selectedNeeds: ["E", "A"],
      primaryNeed: "E",
      location: "Tenerife",
      answers: {
        1: 9, 2: 8, 3: 9,
        4: 8, 5: 7, 6: 7,
        7: 8, 8: 8, 9: 8,
        10: 8, 11: 7, 12: 8,
        13: 4, 14: 5, 15: 6, // Personas / tiempo saturado
        16: 4, 17: 4, 18: 5, // Procesos saturados
        19: 9, 20: 8, 21: 9
      }
    };

    const { pScores, globalScore100 } = calculatePillars(profile.answers);
    const rec = getBrandRecommendation(profile.primaryNeed, pScores, profile.location, profile.tipo, profile.selectedNeeds);

    assert.equal(rec.brand, "Home4Escape", "Debe recomendar Home4Escape");
    assert.match(rec.text, /Canarias/i, "En Canarias debe mencionar equipo propio");
  });

  await t.test("Perfil 4: Pequeño hotel que necesita mejorar procesos y organización", () => {
    const profile = {
      tipo: "hotel",
      selectedNeeds: ["F"],
      primaryNeed: "F",
      location: "Cantabria",
      answers: {
        1: 8, 2: 8, 3: 8,
        4: 7, 5: 7, 6: 6,
        7: 8, 8: 7, 9: 7,
        10: 7, 11: 6, 12: 7,
        13: 4, 14: 5, 15: 5,
        16: 3, 17: 3, 18: 3, // P6 Procesos críticos
        19: 8, 20: 7, 21: 8
      }
    };

    const { pScores, globalScore100 } = calculatePillars(profile.answers);
    const rec = getBrandRecommendation(profile.primaryNeed, pScores, profile.location, profile.tipo, profile.selectedNeeds);

    assert.equal(rec.brand, "FARO", "Debe recomendar FARO");
    assert.match(rec.nextStep, /procesos/i, "El próximo paso debe orientarse a procesos");
  });

  await t.test("Perfil 5: Alojamiento con varias necesidades y sin prioridad clara (H)", () => {
    const profile = {
      tipo: "otro",
      selectedNeeds: ["H"],
      primaryNeed: "H",
      location: "Girona",
      answers: {
        1: 6, 2: 6, 3: 6,
        4: 6, 5: 5, 6: 5,
        7: 4, 8: 4, 9: 3, // Canales bajos
        10: 4, 11: 3, 12: 4,
        13: 6, 14: 6, 15: 6,
        16: 6, 17: 5, 18: 6,
        19: 6, 20: 5, 21: 6
      }
    };

    const { pScores, globalScore100 } = calculatePillars(profile.answers);
    const rec = getBrandRecommendation(profile.primaryNeed, pScores, profile.location, profile.tipo, profile.selectedNeeds);

    assert.equal(rec.brand, "PYME360", "Debe recomendar PYME360 para ordenar prioridades");
    assert.match(rec.nextStep, /sesión de 20 minutos/i, "Debe invitar a sesión de 20 min");
  });
});
