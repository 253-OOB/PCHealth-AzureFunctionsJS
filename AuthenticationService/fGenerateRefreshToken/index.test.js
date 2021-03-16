const rewire = require("rewire")
const index = rewire("./index")
const generateRefreshToken = index.__get__("generateRefreshToken")
// @ponicode
describe("generateRefreshToken", () => {
    test("Normal Input", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, { body: { payload: "aub.aat" } })
        expect(result.status).toBe(200)
    })

    test("Modified Normal Input", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, { body: { payload: "aub.mib" } })
        expect(result.status).toBe(200)
    })

    test("Empty Body", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, { body: {} })
        expect(result.status).toBe(500)
    })

    test("Empty Request (Not practical but usefull check)", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, {})
        expect(result.status).toBe(500)
    })

    test("Empty String Payload", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, { body: { payload: "" } })
        expect(result.status).toBe(200)
    })

    test("Undefined Request", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, undefined)
        expect(result.status).toBe(200)
    })

    test("Undefined Body", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, { body: undefined })
        expect(result.status).toBe(500)
    })

    test("Undefined Payload", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, { body: { payload: undefined } })
        expect(result.status).toBe(500)
    })

    test("Int Payload", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, { body: { payload: 1 } })
        expect(result.status).toBe(500)
    })

    test("Empty Array", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, { body: { payload: [] } })
        expect(result.status).toBe(500)
    })

    test("Array of objects", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, { body: { payload: ["Hello", 1, "Hello"] } })
        expect(result.status).toBe(500)
    })

    test("Array of Strings", () => {
        let result = generateRefreshToken({ res: { status: 200 } }, { body: { payload: ["Hello", "1", "Hello"] } })
        expect(result.status).toBe(500)
    })
})
