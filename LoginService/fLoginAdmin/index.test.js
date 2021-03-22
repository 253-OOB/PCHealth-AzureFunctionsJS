const rewire = require("rewire")

const index = rewire("./index")

const getSignInInfo = index.__get__("getSignInInfo")
const generateRefreshToken = index.__get__("generateRefreshToken")
const generateAccessToken = index.__get__("generateAccessToken")

const Login = index.__get__("Login")
// @ponicode
describe("getSignInInfo", () => {
    test("Existing Username and Organisation", async () => {
        let result = await getSignInInfo({ query: { Username: "aat36", Organisation: "aub" } })
        expect(result.status).toBe(200)
    })

    test("Existing Email", async () => {
        let result = await getSignInInfo({ query: { Email: "aat36@mail.aub.edu" } })
        expect(result.status).toBe(200)
    })

    test("Empty Query", async () => {
        let result = await getSignInInfo({ query: {} })
        expect(result.status).toBe(400)
    })

    test("Existing Organisation + No Username", async () => {
        let result = await getSignInInfo({ query: { Organisation: "aub" } })
        expect(result.status).toBe(400)
    })

    test("Existing Username + No Organisation", async () => {
        let result = await getSignInInfo({ query: { Username: "aat36" } })
        expect(result.status).toBe(400)
    })

    test("Non-Existing Username + Existing Organisation", async () => {
        let result = await getSignInInfo({ query: { Username: "sgfcwgf", Organisation: "aub" } })
        expect(result.status).toBe(200)
    })

    test("Existing Username + Non-Existing Organisation", async () => {
        let result = await getSignInInfo({ query: { Username: "aat36", Organisation: "kjgfuegri" } })
        expect(result.status).toBe(200)
    })

    test("Empty Request", async () => {
        let result = await getSignInInfo({})
        expect(result.status).toBe(400)
    })

    test("Request with no query field", async () => {
        let result = await getSignInInfo({ status: 200 })
        expect(result.status).toBe(400)
    })

    test("Request with non-JSON obj field", async () => {
        let result = await getSignInInfo({ query: 1 })
        expect(result.status).toBe(400)
    })

    test("Request with Email as an int", async () => {
        let result = await getSignInInfo({ query: { Email: 1 } })
        expect(result.status).toBe(400)
    })

    test("Undefined input", async () => {
        let result = await getSignInInfo(undefined)
        expect(result.status).toBe(500)
    })

    test("Request with a Username an int + Correct Organisation", async () => {
        let result = await getSignInInfo({ query: { Username: 1, Organisation: "aub" } })
        expect(result.status).toBe(400)
    })

    test("Request with an Organisation as an int + Correct Username", async () => {
        let result = await getSignInInfo({ query: { Username: "aat36", Organisation: 1 } })
        expect(result.status).toBe(400)
    })

    test("Request with an Organisation as a JSON obj + Correct Username", async () => {
        let result = await getSignInInfo({ query: { Username: "aat36", Organisation: { test: 1 } } })
        expect(result.status).toBe(400)
    })

    test("Request with a Username as a JSON obj + Correct Username", async () => {
        let result = await getSignInInfo({ query: { Username: { test: "test" }, Organisation: "aub" } })
        expect(result.status).toBe(400)
    })

    test("Request with an Email as JSON obj", async () => {
        let result = await getSignInInfo({ query: { Email: { test: 1 } } })
        expect(result.status).toBe(400)
    })
})

// @ponicode
describe("generateRefreshToken", () => {
    test("String 1", async () => {
        let result = await generateRefreshToken("aub.aat36")
        expect(result.status).toBe(200)
    })

    test("Int", async () => {
        let result = await generateRefreshToken(1)
        expect(result.status).toBe(400)
    })

    test("String 2", async () => {
        let result = await generateRefreshToken("\"{\"x\":5,\"y\":6}\"")
        expect(result.status).toBe(200)
    })

    test("Undefined", async () => {
        let result = await generateRefreshToken(undefined)
        expect(result.status).toBe(400)
    })

    test("Empty String", async () => {
        let result = await generateRefreshToken("")
        expect(result.status).toBe(200)
    })

    test("JSON", async () => {
        let result = await generateRefreshToken({ type: "ADD_TODO" })
        expect(result.status).toBe(400)
    })

    test("Boolean False", async () => {
        let result = await generateRefreshToken(false)
        expect(result.status).toBe(400)
    })

    test("Boolean True", async () => {
        let result = await generateRefreshToken(true)
        expect(result.status).toBe(400)
    })
})

// @ponicode
describe("generateAccessToken", () => {
    test("Incorrect Refresh Token", async () => {
        let result = await generateAccessToken("wegcasglqwegfsjgwsdlg")
        expect(result.status).toBe(403)
    })

    test("Integer Input", async () => {
        let result = await generateAccessToken(1)
        expect(result.status).toBe(403)
    })

    test("Undefined Input", async () => {
        let result = await generateAccessToken(undefined)
        expect(result.status).toBe(403)
    })

    test("Empty String Input", async () => {
        let result = await generateAccessToken("")
        expect(result.status).toBe(403)
    })

    test("Boolean false Input", async () => {
        let result = await generateAccessToken(false)
        expect(result.status).toBe(403)
    })

    test("Boolean True Input", async () => {
        let result = await generateAccessToken(true)
        expect(result.status).toBe(403)
    })

    test("Correct Refresh Token", async () => {
        let result = await generateAccessToken("eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiYXViLmFhdDM2IiwiaWF0IjoxNjE2MzQwNzAxfQ.mFaYZbSBCWRkig78sqsAdRj-IPVG2gOQgrLHqkFrP399JjByo69q-clOR5Ha6LeqTQh1GBFe_ZeCK49lv5aRMqdBHpWyIs70v2iSf8pBC2feS6_A1r3rF87pzG2ny8a7yyxu5-s1M__b1QsAF-lrC9j5EkQsYucjbZlhYnN4kMKNl4jIXuIGMQaoAUsm6vVufemdHlwX1zZ3eJsQDmzilHynnnHmLLQDMOOhn5iRBxJ1LvGDZN_J5o0Xqv7RIwC1QChStALl7NNd0hG5Lb4RmSuBeEU3ZLr5hW84LaR8FbUB7swV5fa0DNF5EMIoAvEetsgB7kQIzxyLgaPPa3W8FA")
        expect(result.status).toBe(200)
    })
})

// @ponicode
describe("Login", () => {
    test("Correct Email + Correct Password", async () => {
        let result = await Login({ query: { Email: "aat36@mail.aub.edu", Password: "abc123" } })
        expect(result.status).toBe(200)
    })

    test("Correct Email + Incorrect Password", async () => {
        let result = await Login({ query: { Email: "aat36@mail.aub.edu", Password: "whfwiu" } })
        expect(result.status).toBe(403)
    })

    test("Correct Email + Missing Password Field", async () => {
        let result = await Login({ query: { Email: "aat36@mail.aub.edu" } })
        expect(result.status).toBe(400)
    })

    test("Missing Credential Field", async () => {
        let result = await Login({ query: { Password: "whfwiu" } })
        expect(result.status).toBe(400)
    })

    test("Empty Query Field", async () => {
        let result = await Login({ query: {} })
        expect(result.status).toBe(400)
    })

    test("Correct Organisation + Username + Password", async () => {
        let result = await Login({ query: { Organisation: "aub", Username: "aat36", Password: "abc123" } })
        expect(result.status).toBe(200)
    })

    test("Empty request", async () => {
        let result = await Login({})
        expect(result.status).toBe(400)
    })

    test("Undefined request", async () => {
        let result = await Login(undefined)
        expect(result.status).toBe(500)
    })

    test("Empty String as Email", async () => {
        let result = await Login({ query: { Email: "", Password: "abc123" } })
        expect(result.status).toBe(400)
    })

    test("Empty query", async () => {
        let result = await Login({ query: { Email: "aat36@mail.aub.edu", Password: true } })
        expect(result.status).toBe(400)
    })
})
