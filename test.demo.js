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

	it('should update URL parameter when config is changed using JSON editor ',function(){
		expect(updateUrl).toBeDefined();
		spyOn(window,'updateUrl').and.callThrough();
		var config = {
			cols: ['minmax(max-content,1fr)', 'minmax(min-content,1fr)', 'minmax(min-content,1fr)', 'minmax(min-content,1fr)'],
			rows: ['minmax(max-content,1fr)', 'minmax(max-content,1fr)', 'minmax(max-content,1fr)'],
			cells: [{text:'test'},{col:1,colSpan:4},{row:2,rowSpan:2,order:1}],
			prefix: 'grid'
		};
		var str = JSON.stringify(config);
		updateUrl(config);
		expect(window.updateUrl).toHaveBeenCalled();
		expect(window.location.search.indexOf(window.btoa(str))).not.toEqual(-1);
	});
});
