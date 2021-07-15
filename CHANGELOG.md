<!-- markdownlint-disable MD024 -->
# Change Log

## [Unreleased]

## [2.4.0] - 2021-07-15

### Added

- Workspace Trust support (Supported completely in untrusted workspaces)
- Support for whitespace format
- Support for RGB format without rgb() and configuration options for it (Disabled by default)
- License

### Changed

- Configuration option for marker type is now a list of options

### Fixed

- Fixed contrast ratio computation to follow WCAG 2.0 guidelines

## [2.3.0] - 2017-07-11

### Added

- Highlight variables imported from the files (sass, scss)
- Configuration option for the sass imports lookup folders

## [2.2.0] - 2017-05-15

### Added

- "dot-before" marker type

## [2.1.3] - 2017-04-20

### Added

- Google form to collect the user preffered setting defaults

### Fixed

- Underline style: correct text color in comments

## [2.1.2] - 2017-04-18

### Fixed

- Correct the highlighted offset if context is analyzed

## [2.1.1] - 2017-04-18

### Fixed

- Partial variable matching in sass, less and stylus

## [2.1.0] - 2017-04-18

### Added

- hsl() and hsla() support
- Description for the configuration properties
- Basic variables support within the file (for css, sass, less, stylus)

### Fixed

- Matches in non-color contexts like link with hashes or other places
- White in white-space is colored

### Changed

- Color word matching is always "on" in the style languages (css, less, scss, sass, stylus)

## [2.0.1] - 2017-04-12

### Changed

- Default value for matchWords to false

## [2.0.0] - 2017-04-12

### Added

- Document type filters
- Two new styles for color highlight: "dot" and "foreground"
- Moved list of changes to the CHANGELOG.md file

### Changed

- Extension enabled on all documents
- Complete rewrite to gain maximum performance
- Updated to the latest vscode library

## [1.3.2] - 0000-00-00

- Feat: Add stylus

## [1.3.1] - 0000-00-00

- Feat: Add typescript language to the list
- Feat: Add option to disable the colors in ruler

## [1.3.0] - 0000-00-00

- Feat: Support hex alpha
- Fix: Accidental highlighting of strings like "#1234567890"
- Fix: Highlights non-color array keys in Drupal PHP code

## [1.2.1] - 0000-00-00

- Added new option to disable color words highlight

## [1.2] - 0000-00-00

- New styling modes for the marker: background, underline. Default is "background" now

## [1.1] - 0000-00-00

- Refactored code to prevent memory leaks
- Added configuration for the extension
- Added command highlight current file (if it's not configured to be highlighted automatically)
