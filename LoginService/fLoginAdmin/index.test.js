const rewire = require("rewire")

const index = rewire("./index")

const getSignInInfo = index.__get__("getSignInInfo")





const generateRefreshToken = index.__get__("generateRefreshToken")
// @ponicode
describe("getSignInInfo", () => {
    test("Existing Username and Organisation", async () => {
        let result = await getSignInInfo({ query: { Username: "aat36", Organisation: "aub" } })
        expect(result.status).toBe(200)
        expect(result.sql_resp.recordset[0]).toEqual({ Password: "abc123", OrganisationName: "aub", Username: "aat36", RefreshToken: null })
    })

    test("Existing Email", async () => {
        let result = await getSignInInfo({ query: { Email: "aat36@mail.aub.edu" } })
        expect(result.status).toBe(200)
        expect(result.sql_resp.recordset[0]).toEqual({ Password: "abc123", OrganisationName: "aub", Username: "aat36", RefreshToken: null })
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
        expect(result.sql_resp.recordset[0]).toBe(undefined)
    })

    test("Existing Username + Non-Existing Organisation", async () => {
        let result = await getSignInInfo({ query: { Username: "aat36", Organisation: "kjgfuegri" } })
        expect(result.status).toBe(200)
        expect(result.sql_resp.recordset[0]).toBe(undefined)
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
    test("String", async () => {
        let result = await generateRefreshToken("aub.aat36")
        expect(result.status).toBe(200)
    })

    test("Int", async () => {
        let result = await generateRefreshToken(1)
        expect(result.status).toBe(400)
    })

    test("String", async () => {
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
