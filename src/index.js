const { default: Axios } = require("axios");
const { javaHost, goHost, healthPath, furyToken, comparsionTimes } = require("./config");

function createComparsion(path, javaTime, goTime) {
  return { path, responseTimeJavaMs: `${javaTime}ms`, responseTimeGoMs: `${goTime}ms` }
}

async function doBenchmark(path) {
  const headers = {
    'x-auth-token': furyToken
  }

  comparsion = {
    avg: 0,
    comparsions: []
  }
  let totalJava = 0
  let totalGo = 0
  for (let i = 0; i < comparsionTimes; i++) {
    const javaStart = new Date().getTime()
    await Axios.get(javaHost + path, { headers })
    const javaDuration = new Date().getTime() - javaStart
    totalJava += javaDuration

    const goStart = new Date().getTime()
    await Axios.get(goHost + path, { headers })
    const goDuration = new Date().getTime() - goStart
    totalGo += goDuration

    comparsion.comparsions.push(createComparsion(path, javaDuration, goDuration))
  }
  comparsion.avg = createComparsion(path, totalJava / comparsionTimes, totalGo / comparsionTimes)

  return comparsion
}

(async function doComparsion() {
  console.log("Beginning comparsion")
  console.log(`javaHost=${javaHost}, goHost=${goHost}, healthPath=${healthPath}, furyToken=${furyToken}, comparsionTimes=${comparsionTimes}`)
  try {
    await doBenchmark(healthPath)
    console.log("Health checked")
    const [healthBenchmark] = await Promise.all([
      doBenchmark(healthPath)
    ])
    console.table([healthBenchmark.avg])
    console.table(healthBenchmark.comparsions)
  } catch (error) {
    console.error(error.stack)
    console.error("Comparsion could not be done")
    return -1
  }
  console.log("Comparsion successfully done")
  return 0
})()

