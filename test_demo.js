const fs=require("fs");
const html=fs.readFileSync("./index.html","utf8");
const script=html.split("<script>")[1].split("</script>")[0];
const logic=script.split("/* ============ API")[0];
eval(logic+"\n;Object.assign(globalThis,{CATALOG,DEMO_OVERRIDES,demoResults,score,priorityGaps});");

let pass=0,fail=0;
function t(n,c){if(c){pass++;}else{fail++;console.log("FAIL:",n);}}

const dr=demoResults();
t("demo covers all 93", dr.length===93);
t("demo unique ids", new Set(dr.map(x=>x.id)).size===93);
t("all statuses valid", dr.every(x=>["C","P","M"].includes(x.s)));
t("A.7 all missing", dr.filter(x=>x.theme==="A.7").every(x=>x.s==="M"));
t("A.5.15 covered", dr.find(x=>x.id==="A.5.15").s==="C");
t("A.8.13 covered", dr.find(x=>x.id==="A.8.13").s==="C");
t("A.8.24 crypto missing", dr.find(x=>x.id==="A.8.24").s==="M");
t("M entries have generated recs", dr.filter(x=>x.s==="M").every(x=>x.r.length>10));
t("stale override ignored", !dr.some(x=>x.id==="A.1.demo"));
const sc=score(dr);
t("demo score plausible", sc.pct>=15&&sc.pct<60);
t("priority gaps nonempty", priorityGaps(dr).length===10);
console.log(`\n${pass} passed, ${fail} failed  (demo coverage score: ${sc.pct}%, C:${sc.totals.C} P:${sc.totals.P} M:${sc.totals.M})`);
process.exit(fail?1:0);
