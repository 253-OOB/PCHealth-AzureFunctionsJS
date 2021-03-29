const rewire = require("rewire")



const index = rewire("./index")



const generateLeafCreationToken = index.__get__("generateLeafCreationToken")



// @ponicode
describe("generateLeafCreationToken", () => {
    test("Normal Input", () => {
        let result = generateLeafCreationToken({ body: { payload: "aub.aat" } })
        expect(result.status).toBe(200)
    })

    test("Modified Normal Input", () => {
        let result = generateLeafCreationToken({ body: { payload: "aub.mib" } })
        expect(result.status).toBe(200)
    })

    test("Empty Body", () => {
        let result = generateLeafCreationToken({ body: {} })
        expect(result.status).toBe(400)
    })

    test("Empty Request (Not practical but usefull check)", () => {
        let result = generateLeafCreationToken({})
        expect(result.status).toBe(400)
    })

    test("Empty String Payload", () => {
        let result = generateLeafCreationToken({ body: { payload: "" } })
        expect(result.status).toBe(200)
    })

    test("Undefined Request", () => {
        let result = generateLeafCreationToken(undefined)
        expect(result.status).toBe(500)
    })

    test("Undefined Body", () => {
        let result = generateLeafCreationToken({ body: undefined })
        expect(result.status).toBe(400)
    })

    test("Undefined Payload", () => {
        let result = generateLeafCreationToken({ body: { payload: undefined } })
        expect(result.status).toBe(400)
    })

    test("Int Payload", () => {
        let result = generateLeafCreationToken({ body: { payload: 1 } })
        expect(result.status).toBe(400)
    })

    test("Empty Array", () => {
        let result = generateLeafCreationToken({ body: { payload: [] } })
        expect(result.status).toBe(400)
    })

    test("Array of objects", () => {
        let result = generateLeafCreationToken({ body: { payload: ["Hello", 1, "Hello"] } })
        expect(result.status).toBe(400)
    })

    test("Array of Strings", () => {
        let result = generateLeafCreationToken({ body: { payload: ["Hello", "1", "Hello"] } })
        expect(result.status).toBe(400)
    })
})
