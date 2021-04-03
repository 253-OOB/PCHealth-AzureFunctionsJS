const rewire = require("rewire")
const index = rewire("./index")
const VerifyFormat = index.__get__("VerifyFormat")
// @ponicode
describe("VerifyFormat", () => {
    test("0", () => {
        let result = VerifyFormat({ query: { Password: "1Ki77y", Name: "elio@example.com", Email: "bed-free@tutanota.de" } })
        expect(result).toBe(false)
    })

    test("1", () => {
        let result = VerifyFormat({ query: { Password: "!Lov3MyPianoPony", Name: "Elio", Email: "user@host:300" } })
        expect(result).toBe(false)
    })

    test("2", () => {
        let result = VerifyFormat({ query: { Password: "$p3onyycat", Name: "Elio", Email: "user1+user2@mycompany.com" } })
        expect(result).toBe(false)
    })

    test("3", () => {
        let result = VerifyFormat({ query: { Password: ".Matrix53", Name: "Elio", Email: "user1+user2@mycompany.com" } })
        expect(result).toBe(false)
    })

    test("4", () => {
        let result = VerifyFormat({ query: { Password: "!ush3r", Name: "Dillenberg", Email: "bed-free@tutanota.de" } })
        expect(result).toBe(false)
    })

    test("5", () => {
        let result = VerifyFormat({ query: { Password: "!Lov3MyPianoPony", Name: "Dillenberg", Email: "ponicode.com" } })
        expect(result).toBe(false)
    })

    test("6", () => {
        let result = VerifyFormat({ query: { Password: "!Lov3MyPianoPony", Name: "Elio", Email: "email@Google.com" } })
        expect(result).toBe(true)
    })

    test("7", () => {
        let result = VerifyFormat({ query: { Password: ".Matrix(", Name: "\u000b", Email: "user" } })
        expect(result).toBe(false)
    })

    test("8", () => {
        let result = VerifyFormat({ query: { Password: ".Matrix53", Name: "Elio", Email: "email@Google.com" } })
        expect(result).toBe(false)
    })

    test("9", () => {
        let result = VerifyFormat({ query: { Password: "1Ki77y%", Name: "elio@@example.com", Email: "bed-free@tutanota.de@" } })
        expect(result).toBe(false)
    })

    test("10", () => {
        let result = VerifyFormat(undefined)
        expect(result).toBe(false)
    })

    test("12", () => {
        let result = VerifyFormat({})
        expect(result).toBe(false)
    })

    test("12", () => {
        let result = VerifyFormat({ query: {} })
        expect(result).toBe(false)
    })

    test("13", () => {
        let result = VerifyFormat({ query: { Password: "", Name: "", Email: "" } })
        expect(result).toBe(false)
    })

    test("14", () => {
        let result = VerifyFormat({ query: { Password: "12345Ma#!", Name: "Marwan", Email: "smtbkdsavfghidjvnsbfuyeijdbfnabueqwyaijfdkbnqibeaywouhfjkbnqaibsdoufhjklbqnasdbyiofuhjlkandsboyifuhjasdfygoiuhqjlkadnsibqygouwehfasjdhewygihuasovjfeaidsvhigfuheroqfjwakdnsvfheuigahusofgjfeagdisvugifeqgjwasufgifeqjgadsuifehrfgaifheqrfjgwaufsiefjqghuwiwqefjnghwuiwbeqjfnghwu@gmail.com" } })
        expect(result).toBe(false)
    })

    test("15", () => {
        let result = VerifyFormat({ query: { Password: "12345Ma#!", Name: "Marwan", Email: "email@gmailgufychvjguiyftyrdfcghjvugyftdrxfghcvjuyftdrxfcghvjguyftdrfchgvjbgiyuftcghvjbkgiyuftcghvjbkiugyftdrcghvjbgiyuftdrcghjvbkiugyftcghvjbkiugyftdrcfgjvhugiyuftdrcfgvhbiugyftcghjvbiugyftdrcfhgvjbigyuftdrcfgvhbigyuftdrcfhgvjbvugftydrxcfgvuhbgyvftdrxfchgvjbkuvgycftxdrcfygvubhiuvgyctrxyfgvubhigvycftdrxsedtcfyvgubhigvytcrdxcfyvgbuhinbugyvftcdrxcfyvgubhigvyftcdrxcfyvgubvfctdrxesdtcfyvgubhigyvcftdrxcfyvgubvfctdrxcfyvgubhigvyftcdrxesdtcfyvgubhigyvfctdrxcfyvg.com" } })
        expect(result).toBe(false)
    })
})
