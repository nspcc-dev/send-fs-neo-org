# Changelog

Changelog for SendFS

## [Unreleased]

## [0.6.6] - 2025-04-04

### Fixed

- Missing renderAs property for bulma components (#136)

## [0.6.5] - 2025-04-04

### Changed

- Emotionless footer (#133)
- Vite and Node 18 are used now (#132)

## [0.6.4] - 2025-02-05

### Fixed

- Use Content-Type in web properly (#128)

## [0.6.3] - 2025-01-22

### Changed

- UI checks for inappropriate content types now displaying more user-friendly errors (#125)
- Missing content type is treated as application/octet-stream now which allows to upload some files that were rejected previously (#125)

## [0.6.2] - 2024-09-02

### Fixed

- About page link not working when served from NeoFS (#122)

## [0.6.1] - 2024-08-30

### Fixed

- Missing Typescript dependency (#120)

## [0.6.0] - 2024-08-30

### Added

- Opengraph image meta tag (#112)
- Description page (#74)

### Changed

- Moved to Typescript (#110)
- Use new (0.9.0+) REST gateway APIs (#114)

## [0.5.3] - 2023-10-05

### Fixed

- NPM warnings (#100)
- Minimal height (#107)
- Tooltip display (#109)

### Changed

- Allow uploading up to 200M (#97)
- Updated YouTube link (#101)
- Add hosting link (#106)

## [0.5.2] - 2023-07-03

### Changed

- Clarified epochs/hours relationship (#93)
- Improved handling of missing objects (#94)

## [0.5.1]

### Fixed

- A number of stylistic UI adjustments (#23, #24, #30, #37, #38, #46, #52, #53, #54, #55, #60, #69, #76, #78, #85, #86)
- Uploading files with authorization via proxy (#44)
- Upload error handling (#45, #88)

### Added

- Website version in the footer (#28, #68, #84)
- Proper Content-Security-Policy (#42, #79)
- Proper license (#31)
- More metadata on the "load" page (#77, #91)

### Changed

- App autoversioning scheme (#39, #41)
- New README with up-to-date configuration and instructions (#31, #58, #59, #66, #75)

### Removed

- REACT_APP_EPOCH_LINE configuration, it's a part of the app now since it can't change unless netmap contract changes (#31)

## [0.5.0]

The first React version fixing #12, #13, #14, #15, #16.

## pre-0.5.0

See git log.

[0.5.0]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.2.6...v0.5.0
[0.5.1]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.5.0...v0.5.1
[0.5.2]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.5.1...v0.5.2
[0.5.3]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.5.2...v0.5.3
[0.6.0]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.5.3...v0.6.0
[0.6.1]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.6.0...v0.6.1
[0.6.2]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.6.1...v0.6.2
[0.6.3]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.6.2...v0.6.3
[0.6.4]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.6.3...v0.6.4
[0.6.5]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.6.4...v0.6.5
[0.6.6]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.6.5...v0.6.6
[Unreleased]: https://github.com/nspcc-dev/send-fs-neo-org/compare/v0.6.6...master
