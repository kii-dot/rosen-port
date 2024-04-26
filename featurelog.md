
# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
 
## [Unreleased] - 2024-04-22
 
### Added
MAJOR
- [Rosen-Port-UI](./apps/rosen-port-ui/readme.md)
  MAJOR V1 UI and Frontend for Rosen-Port, this also includes the APIs for frontend calls. Utilizes Rosen-Port-SDK
- [Rosen-Port-Cron](./apps/rosen-port-cron/readme.md)
  MAJOR V1 Rosen-Port's Cron-job to process txs from db, this handles bridging and refunds

SDKs
- [Rosen-Port-DB](./packages/rosen-port-db/readme.md)
  MINOR Created Rosen-Port-DB-SDK :v:
- [Multi-Chain-Payment-SDK](./packages/multi-chain-payment/readme.md)
  MINOR Implement Multi-Chain-Payment-SDK
- [Rosen-Port-SDK](./packages/rosen-port-sdk/readme.md)
  MINOR Implement Rosen-Port-SDK to make Rosen-Port features accessible for UI, backend, and future users. This sdk creates txs for wallets to sign that is sent to Rosen-Port wallets.
- [Rosen-SDK](./packages/rosen-sdk/readme.md)
  MINOR Implement Rosen-SDK that utilizes Multi-Chain-Payment-SDK to create Rosen-Bridge txs
   
### Changed
 
### Fixed
 