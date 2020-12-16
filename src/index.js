const { default: Axios } = require("axios");
const { javaHost, goHost, healthPath, furyToken, comparsionTimes } = require("./config");

function createComparsion(path, javaTime, goTime, javaStatus, goStatus) {
  return { path, responseTimeJavaMs: javaTime, responseTimeGoMs: goTime, responseStatusJava: javaStatus, responseStatusGo: goStatus }
}

async function doBenchmark(path) {
  let totalJava = 0
  let totalGo = 0
  const [javaResponse, goResponse] = await Promise.all([
    get(javaHost, path),
    get(goHost, path)
  ])
  totalJava += javaResponse.duration
  totalGo += goResponse.duration

  return createComparsion(path, javaResponse.duration, goResponse.duration, javaResponse.status, goResponse.status)
}

(async function doComparsion() {
  console.log("Beginning comparsion...")
  console.table({ javaHost, goHost, healthPath, furyToken, comparsionTimes })
  try {
    await doBenchmark(healthPath)
    console.log("Executing in serial...")
    healthResponse = await doBenchmark(healthPath);
    size10Response = await doBenchmark('/benchmark?times=10');
    size100Response = await doBenchmark('/benchmark?times=100');
    size1000Response = await doBenchmark('/benchmark?times=1000');
    size10000Response = await doBenchmark('/benchmark?times=10000');
    console.table([
      healthResponse,
      size10Response,
      size100Response,
      size1000Response,
      size10000Response,
    ])
    console.log("Executing in parallel...")
    const [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28, r29, r30, r31, r32, r33, r34, r35, r36, r37, r38, r39, r40] = await Promise.all([
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
      doBenchmark('/benchmark?times=10000'),
      doBenchmark('/benchmark?times=100000'),
    ])
    console.table([r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28, r29, r30, r31, r32, r33, r34, r35, r36, r37, r38, r39, r40]);
  } catch (error) {
    console.error(error.stack)
    console.error("Comparsion could not be done")
    return -1
  }
  console.log("Comparsion successfully done")
  return 0
})()

async function get(host, path) {
  const headers = {
    'x-auth-token': furyToken
  }
  let status = 'ok'
  const start = new Date().getTime();
  try {
    await Axios.get(host + path, { headers });
  } catch (error) {
    console.error(`problem=${host + path}`);
    console.error(error.stack)
    status = 'error'
  }
  const duration = new Date().getTime() - start;
  return { duration, status };
}

