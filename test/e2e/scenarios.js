'use strict';

describe('molApp App', function() {

  it('should redirect index.html to index.html#/rides', function() {
    browser().navigateTo('../../app/index.html#/rides');
    expect(browser().location().url()).toBe('/rides');
  });

  describe('On load, populates the initial page view as expected', function (){

        beforeEach(function ()
        {
            browser().navigateTo('../../app/index.html#/rides');
        });

        it('Creates a list of 2 rides', function ()
        {
             expect(repeater('#rides option').count()).toBe(3);
        });

      

         
    });

    describe('Filter content by ', function ()
    {
        
        it('Should be possible to filter list by offroad rides and return a list of 5 rides',
        function() {
            
           select('ridesquery').option('Offroad');
           expect(repeater('#routes li').count()).toBe(5);

        });
        
        
        it('Should be possible to filter list by onroad rides and return a list of 5 rides',
        function() {
            
           select('ridesquery').option('Onroad');
           expect(repeater('#routes li').count()).toBe(5)
        });

    });

    describe('Display maps view', function() {
 
        beforeEach(function() {
          browser().navigateTo('../../app/index.html#/maps/offroad_day_1');
        });
 

        //it('Should display correct page title', function() {
        //  expect(binding('ridedata.title')).toBe('Offroad Day 1');
        //});

        //it('Should display correct mapfile', function() {
        //  expect(binding('ridedata.mapfile')).toBe('data/gpx/offroad/Offroad1.gpx');
        //});

        //it('Should display correct html file', function() {
        //  expect(binding('ridedata.html')).toBe('data/pages/offroad/day1.html');
        //});

        //it('Should display correct lat', function() {
        //  expect(binding('ridedata.lat')).toBe('32.403224');
        //});

        //it('Should display correct lng', function() {
        //  expect(binding('ridedata.lng')).toBe('34.866703');
        //});

    });

});
