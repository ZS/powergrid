describe("demo", function () {

	it('should fetch the config based on the URL search parameter', function () {
		expect(fetchConfig).toBeDefined();

		var obj = { a: 1 };
		var str = "eyJhIjoxfQ=="; // Encoded string for {a: 1}
		spyOn(getCurrentLocation, 'getSearchStr').and.callFake(function () {
			return "?q=" + str;
		});
		expect(fetchConfig()).toEqual(obj);
	});

	it('should return null if the URL search parameter is incorrect', function () {
		var str = "SomeRandomString";
		spyOn(getCurrentLocation, 'getSearchStr').and.callFake(function () {
			return "?q=" + str;
		});
		expect(fetchConfig()).toEqual(null);
	});

});
