
const fetch = require("node-fetch");
const context = require('../defaultContext');

// TODO: Add tests to verify the Refresh 

test("0 - Default Test", async () => {

    expect(1).toEqual( 1 );

});

test("5 - fGenerateRefreshToken should return 500 when passing a raw JSON.", async () => {

    const getToken = await fetch (
        "http://localhost:7072/api/fGenerateRefreshToken", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { payload: "hello" }
        }
    )

    const toTest = {
        status: getToken.status,
    }

    expect( toTest ).toEqual({
        status: 500,
    });

});

test("4 - fGenerateRefreshToken should return 404 when Using GET method.", async () => {

    const getToken = await fetch (
        "http://localhost:7072/api/fGenerateRefreshToken", 
        {
            method: "GET",
        }
    )

    const toTest = {
        status: getToken.status,
    }

    expect( toTest ).toEqual({
        status: 404,
    });

});

test("3 - fGenerateRefreshToken should return 500 when providing no payload attribute inside the json of the body.", async () => {

    const getToken = await fetch (
        "http://localhost:7072/api/fGenerateRefreshToken", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ test: "hello" })
        }
    )

    const toTest = {
        status: getToken.status,
    }

    expect( toTest ).toEqual({
        status: 500,
    });

});

test("2 - fGenerateRefreshToken should return 500 when providing no body.", async () => {

    const getToken = await fetch (
        "http://localhost:7072/api/fGenerateRefreshToken", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }
    )

    const toTest = {
        status: getToken.status,
    }

    expect( toTest ).toEqual({
        status: 500,
    });

});

test("1 - fGenerateRefreshToken should return 200 OK along with a Refresh Token", async () => {

    const getToken = await fetch (
        "http://localhost:7072/api/fGenerateRefreshToken", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "payload": "test" })
        }
    )

    const body  = await getToken.body["refreshToken"];
    
    throw new Error( JSON.stringify(body) );

    expect( 1 ).toEqual({
        status: 200,
    });

});