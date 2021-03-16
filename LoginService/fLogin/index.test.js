const rewire = require("rewire")
const index = rewire("./index")
const getSignInInfo = index.__get__("getSignInInfo")

/* TODO: (Issue #14) 

- Add tests for non-string input values in getSignInInfo

*/

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
})
