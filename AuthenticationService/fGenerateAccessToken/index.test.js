const rewire = require("rewire")



const index = rewire("./index")



const generateAccessToken = index.__get__("generateAccessToken")



// @ponicode
describe("generateAccessToken", () => {
    test("Existing Refresh Token 1", async () => {
        let result = await generateAccessToken({ body: { refreshToken: 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiYXViLmFhdDM2IiwiaWF0IjoxNjE2MDAxMzQyfQ.msKslFtton6uQ_JKPU1g61XG2A7pCtbxehNlxvstldAl7koAzHUtAY-f5uhlRmBBsPnEo4gDDFqZ1vxmGULhntX5jlUivVbIMp33ncFDF4uZFiiJSrZSMTur0qPvzJTuY9_dy2dOTQ3-BMOSecLx0iCA7JvFo4-mosET4ikTrj58co2rdClcXa7wdkzL5RekEbtT_kR3OntPBP1t8lSVFKN38_112zK5onqQ4Ss8Wh_59EZ3I3bkHeUP7esUJK-KfEWYxoitv55QSXFxYOm78EfVGf6HQDbcYoVy8C2YNpFpQf15Zrl2sZrOOrzisfs--FNzNoZS_XqfLlGdjqSLww' } })
        expect(result.status).toBe(200)
    })

    test("Existing Refresh Token 2", async () => {
        let result = await generateAccessToken({ body: { refreshToken: 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiYXViLm1pYjE2IiwiaWF0IjoxNjE2MDAxMzgwfQ.yFfvppqcmfywWfjYL1ao7I17uXnztowwbcku6fibUBgOiFMfdd1orX7eF_KMkmpi835fzfc7WeriM7dBIJnzqkK9csBt6ZSQJi9MckD22HDfrHyaVNdgjB3f8f_BcTPPCMP1ih768zi8jDLKH8xQczJ8ChrE1DqaxqXcEqZLuIPQwCX4YYzVm2NOmRwzKyhUt9ZtmQWNXZicjH4jHTTsgYzNyNMl2n52shJZsEbjgwKHH00dA2yMk4I_DRM90o4L3xJil5xI4sVFJZtGxqRaz9Vm08zlpZhvy3mj-C0gpb8LmeFJm7jc1gH80_P3flM4Wis0t5QW9P-P12EmBKmv4A' } })
        expect(result.status).toBe(200)
    })

    test("Non-String Refresh Token 1", async () => {
        let result = await generateAccessToken({ body: { refreshToken: { This: "is", an: "object", Do: "0", you: 1, Like: "2", it: 10000 } } })
        expect(result.status).toBe(403)
    })

    test("Undefined refreshToken", async () => {
        let result = await generateAccessToken({ body: { refreshToken: undefined } })
        expect(result.status).toBe(403)
    })

    test("Non-Existing Refresh Token 2", async () => {
        let result = await generateAccessToken({ body: { refreshToken: "owheoihewohdgwkjge" } })
        expect(result.status).toBe(403)
    })

    test("Empty Body", async () => {
        let result = await generateAccessToken({ body: {} })
        expect(result.status).toBe(403)
    })

    test("Empty Request (Not practical but usefull check)", async () => {
        let result = await generateAccessToken({})
        expect(result.status).toBe(500)
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
        expect(result.status).toBe(500)
    })

    test("Non-existing token 3", async () => {
        let result = await generateAccessToken({ body: { refreshToken: "123" } })
        expect(result.status).toBe(403)
    })

    test("Int refreshToken", async () => {
        let result = await generateAccessToken({ body: { refreshToken: 1 } })
        expect(result.status).toBe(403)
    })

    test("Empty Array", async () => {
        let result = await generateAccessToken({ body: { refreshToken: [] } })
        expect(result.status).toBe(403)
    })

    test("Array of objects", async () => {
        let result = await generateAccessToken({ body: { refreshToken: ["Hello", 1, "Hello"] } })
        expect(result.status).toBe(403)
    })

    test("Array of Strings", async () => {
        let result = await generateAccessToken({ body: { refreshToken: ["Hello", "1", "Hello"] } })
        expect(result.status).toBe(403)
    })
})
