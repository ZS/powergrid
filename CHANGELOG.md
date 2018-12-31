# Changelog
## [v0.4](https://github.com/ZS/powergrid/compare/v0.2...master) (2018-28-12)

### Added
- Improved overall UI of the demo.
- There is no side configuration panel now. We can open a configuration modal by clicking anywhere on the grid.
- All the configurations (Grid settings, JSON Editor, Source code) have been accomodated in one modal only.
- User interface for the Grid settings has been improved.
- Added a help section in the modal where we can see all the warnings and some important web links.
- UI is now driven through URL parameters, so you can easily share your configuration.
- Enabled use of images instead of text in the configuration.
- Used [wicked-elements](https://github.com/WebReflection/wicked-elements) library to make our code more modular.
- Improved community checklist.

### Fixes
- Fixed: Let explicitly position items in rows or columns we don't define in the grid.
- Moved warnings inside configuration modal.
- Various minor fixes and enhancements. 

## [v0.2](https://github.com/ZS/powergrid/compare/v0.1...v0.2) (2018-26-07)

### Added
- [Alerts](https://getbootstrap.com/docs/4.0/components/alerts/) to show warnings/errors while configuring grid rows/cols.
- A brand new UI based Grid Builder. Now anyone without prior JSON knowledge can too build a grid.
- A feature that allows to configure an individual grid cell by just clicking over it.
- CONTRIBUTING guide for those whose would like contribute to this project.

### Fixed
- Fixed a bug in functionality that allows setting Grid and Cell level align/justify properties.
- Fixed: Saving a config with invalid JSON shouldn't reset it to default.
- Fixed: Classes for grid aligment are missing in the resulting code.
- Various minor fixes.

## [v0.1](https://github.com/ZS/powergrid/compare/v0.1...master) (2018-16-07)
- First Release. 
- Powergrid is an easy to use yet a powerful tool that helps you to readily build cross-browser CSS Grid system. 

### Added
- This CHANGELOG file.
- Configuration Panel (powered by [SlideReveal](https://github.com/nnattawat/slideReveal)).
- Feature to display and edit JSON Configuration (powered by [JSONEditor](https://github.com/josdejong/jsoneditor)).
- Feature to fetch/sync Configuration via address URL.
- Feature to display/copy resultant HTML and CSS (powered by [Highlight.js](https://github.com/isagalaev/highlight.js)).
- Setup for CI.
- Support for Node usage of Powergrid functions.
- README containing basic information regarding Powergrid.
