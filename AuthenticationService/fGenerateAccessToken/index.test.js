
const rewire = require("rewire")
const index = rewire("./index")
const generateAccessToken = index.__get__("generateAccessToken")


// @ponicode
describe("generateAccessToken", () => {
    test("Existing Refresh Token 1", async () => {
        let result = await generateAccessToken({ body: { refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiYXViLmFhdDM2IiwiaWF0IjoxNjE1OTUxNDI4fQ.GSMrXxvSjEmhrwATO0dNsbZpK-oVITJe2--fa8AvdUU" } })
        expect(result.status).toBe(200)
    })

    test("Existing Refresh Token 2", async () => {
        let result = await generateAccessToken({ body: { refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiYXViLm1pYjE2IiwiaWF0IjoxNjE1OTUxNTU1fQ.tRDzV8hI_zXi9mB1HWilaavKEbEH108QrnJVKpGZ7KQ" } })
        expect(result.status).toBe(200)
    })

    test("Non-String Refresh Token 1", async () => {
        let result = await generateAccessToken({ body: { refreshToken: { This: "is", an: "object", Do: "0", you: 1, Like: "2", it: 10000 } } })
        expect(result.status).toBe(400)
    })

    test("Undefined refreshToken", async () => {
        let result = await generateAccessToken({ body: { refreshToken: undefined } })
        expect(result.status).toBe(400)
    })

    test("Non-Existing Refresh Token 2", async () => {
        let result = await generateAccessToken({ body: { refreshToken: "owheoihewohdgwkjge" } })
        expect(result.status).toBe(403)
    })

    test("Empty Body", async () => {
        let result = await generateAccessToken({ body: {} })
        expect(result.status).toBe(400)
    })

    test("Empty Request (Not practical but usefull check)", async () => {
        let result = await generateAccessToken({})
        expect(result.status).toBe(400)
    })

    test("Empty String refreshToken", async () => {
        let result = await generateAccessToken({ body: { refreshToken: "" } })
        expect(result.status).toBe(403)
    })

    test("Undefined Request", async () => {
        let result = await generateAccessToken(undefined)
        expect(result.status).toBe(500)
    })

    test("Undefined Body", async () => {
        let result = await generateAccessToken({ body: undefined })
        expect(result.status).toBe(400)
    })

    test("Undefined refreshToken", async () => {
        let result = await generateAccessToken({ body: { refreshToken: undefined } })
        expect(result.status).toBe(400)
    })

    test("Non-existing token 3", async () => {
        let result = await generateAccessToken({ body: { refreshToken: "123" } })
        expect(result.status).toBe(403)
    })

    test("Undefined refreshToken", async () => {
        let result = await generateAccessToken({ body: { refreshToken: undefined } })
        expect(result.status).toBe(400)
    })

    test("Int refreshToken", async () => {
        let result = await generateAccessToken({ body: { refreshToken: 1 } })
        expect(result.status).toBe(400)
    })

    test("Empty Array", async () => {
        let result = await generateAccessToken({ body: { refreshToken: [] } })
        expect(result.status).toBe(400)
    })

    test("Array of objects", async () => {
        let result = await generateAccessToken({ body: { refreshToken: ["Hello", 1, "Hello"] } })
        expect(result.status).toBe(400)
    })

    test("Array of Strings", async () => {
        let result = await generateAccessToken({ body: { refreshToken: ["Hello", "1", "Hello"] } })
        expect(result.status).toBe(400)
    })

})