<a name="0.6.5"></a>
## [0.6.5](https://github.com/seiyria/openchallenge/compare/0.6.5...v0.6.5) (2015-10-29)




<a name="0.6.5"></a>
## [0.6.5](https://github.com/seiyria/openchallenge/compare/0.6.4...0.6.5) (2015-10-29)


### Bug Fixes

* **tournaments:** made between-match lines not overlap in some testable cases ([e8e684b](https://github.com/seiyria/openchallenge/commit/e8e684b)), closes [#76](https://github.com/seiyria/openchallenge/issues/76)
* **tournaments:** very long lines sometimes overlapped a match block ([8a5dbd0](https://github.com/seiyria/openchallenge/commit/8a5dbd0)), closes [#77](https://github.com/seiyria/openchallenge/issues/77)



<a name="0.6.4"></a>
## [0.6.4](https://github.com/seiyria/openchallenge/compare/0.6.3...0.6.4) (2015-10-26)




<a name="0.6.3"></a>
## [0.6.3](https://github.com/seiyria/openchallenge/compare/0.6.2...0.6.3) (2015-10-19)


### Bug Fixes

* **scores:** scores should now calculate properly in more cases ([639f589](https://github.com/seiyria/openchallenge/commit/639f589))



<a name="0.6.2"></a>
## [0.6.2](https://github.com/seiyria/openchallenge/compare/0.6.1...0.6.2) (2015-10-19)


### Bug Fixes

* **consistency:** all pages alert you if you do not own the player set now ([916ab22](https://github.com/seiyria/openchallenge/commit/916ab22))
* **homePage:** blocks should be more normal sized ([a49517c](https://github.com/seiyria/openchallenge/commit/a49517c))
* **navigation:** the menu button is no longer a giant hitbox ([202c4e8](https://github.com/seiyria/openchallenge/commit/202c4e8))
* **tournamentManager:** you can now see page 2 of tournaments ([728ed61](https://github.com/seiyria/openchallenge/commit/728ed61))
* **tournaments:** the station and round number are now separate again ([2d3af71](https://github.com/seiyria/openchallenge/commit/2d3af71))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/seiyria/openchallenge/compare/0.6.0...0.6.1) (2015-10-18)




<a name="0.6.0"></a>
# [0.6.0](https://github.com/seiyria/openchallenge/compare/0.5.0...0.6.0) (2015-10-18)


### Bug Fixes

* **tournament:** changing options won't break tournaments ([2e9c0c9](https://github.com/seiyria/openchallenge/commit/2e9c0c9))
* **tournamentPrep:** rounding score in player display ([85fb8c1](https://github.com/seiyria/openchallenge/commit/85fb8c1))
* **tournaments:** bring back some backwards compatibility ([0e65287](https://github.com/seiyria/openchallenge/commit/0e65287))
* **tournaments:** hide tournament menu when tournament is unavailable ([6ff8b71](https://github.com/seiyria/openchallenge/commit/6ff8b71))
* **tournaments:** it is always possible to change between all possible tournament configs now ([a81acd7](https://github.com/seiyria/openchallenge/commit/a81acd7))
* **tournaments:** social icons have appropriate colors ([ed48cfa](https://github.com/seiyria/openchallenge/commit/ed48cfa)), closes [#68](https://github.com/seiyria/openchallenge/issues/68)
* **userManager:** player bucket no longer clears when adding a new player ([e43b7eb](https://github.com/seiyria/openchallenge/commit/e43b7eb)), closes [#61](https://github.com/seiyria/openchallenge/issues/61)

### Features

* **tournaments:** can now assign station numbers to tournament rounds ([7ec6380](https://github.com/seiyria/openchallenge/commit/7ec6380)), closes [#60](https://github.com/seiyria/openchallenge/issues/60)
* **tournaments:** there is now an upcoming matches view ([9de9c1f](https://github.com/seiyria/openchallenge/commit/9de9c1f)), closes [#62](https://github.com/seiyria/openchallenge/issues/62)
* **tournaments:** tournaments with no scores can be reconfigured ([06849c8](https://github.com/seiyria/openchallenge/commit/06849c8)), closes [#48](https://github.com/seiyria/openchallenge/issues/48)
* **tournaments:** when editing the options for a tournament, you can now add your player bucket ([0858626](https://github.com/seiyria/openchallenge/commit/0858626)), closes [#65](https://github.com/seiyria/openchallenge/issues/65)
* **userManager:** selected users can now be exported between sets ([74f0a3c](https://github.com/seiyria/openchallenge/commit/74f0a3c)), closes [#46](https://github.com/seiyria/openchallenge/issues/46)


### BREAKING CHANGES

* tournaments: Some old tournaments may be broken.



<a name="0.5.0"></a>
# [0.5.0](https://github.com/seiyria/openchallenge/compare/0.4.4...0.5.0) (2015-10-14)


### Bug Fixes

* **dialogs:** all dialogs should work better on mobile resolutions ([d4782ec](https://github.com/seiyria/openchallenge/commit/d4782ec))
* **quickActions:** quick actions button should now stay in the bottom right ([00de65d](https://github.com/seiyria/openchallenge/commit/00de65d))
* **scoring:** score header is actually usable on mobile ([46a6f60](https://github.com/seiyria/openchallenge/commit/46a6f60))
* **settings:** settings page no longer squishes on mobile ([0fbf901](https://github.com/seiyria/openchallenge/commit/0fbf901))
* **social:** url copy-to-clipboard gives correct url now ([5ef07b6](https://github.com/seiyria/openchallenge/commit/5ef07b6))
* **tournaments:** tournament header tools moved to fab menu on mobile ([18ef0d0](https://github.com/seiyria/openchallenge/commit/18ef0d0)), closes [#54](https://github.com/seiyria/openchallenge/issues/54)

### Features

* **app:** app will now ask if you want to leave and are offline ([a991b07](https://github.com/seiyria/openchallenge/commit/a991b07)), closes [#57](https://github.com/seiyria/openchallenge/issues/57)
* **tournaments:** option to allow scores up to 999,999,999,999 ([88adb36](https://github.com/seiyria/openchallenge/commit/88adb36)), closes [#51](https://github.com/seiyria/openchallenge/issues/51)



<a name="0.4.4"></a>
## [0.4.4](https://github.com/seiyria/openchallenge/compare/0.4.3...0.4.4) (2015-10-13)




<a name="0.4.3"></a>
## [0.4.3](https://github.com/seiyria/openchallenge/compare/0.4.2...0.4.3) (2015-10-13)


### Bug Fixes

* **allManagers:** fixing top-row buttons click zones (firefox bug) ([7a77ba2](https://github.com/seiyria/openchallenge/commit/7a77ba2)), closes [#55](https://github.com/seiyria/openchallenge/issues/55)
* **tournament:** scoring now works if one score is 0 ([ab92b57](https://github.com/seiyria/openchallenge/commit/ab92b57))

### Features

* **desktop:** added a way to make a desktop build for all platforms ([977267f](https://github.com/seiyria/openchallenge/commit/977267f)), closes [#19](https://github.com/seiyria/openchallenge/issues/19)



<a name="0.4.2"></a>
## [0.4.2](https://github.com/seiyria/openchallenge/compare/0.4.1...0.4.2) (2015-10-10)


### Bug Fixes

* **tournamentManager:** properly unlink tournaments if their event is deleted. ([17a0cff](https://github.com/seiyria/openchallenge/commit/17a0cff)), closes [#40](https://github.com/seiyria/openchallenge/issues/40)
* **tournaments:** Allow reconnect if broadcast is turned private ([88ae10f](https://github.com/seiyria/openchallenge/commit/88ae10f)), closes [#44](https://github.com/seiyria/openchallenge/issues/44)

### Features

* **scoring:** added ELL scoring ([05d2317](https://github.com/seiyria/openchallenge/commit/05d2317)), closes [#14](https://github.com/seiyria/openchallenge/issues/14)
* **tournaments:** Added FFA tournaments ([e76ac59](https://github.com/seiyria/openchallenge/commit/e76ac59))
* **tournaments:** added link button to allow for easier copying of tournament urls ([d658497](https://github.com/seiyria/openchallenge/commit/d658497)), closes [#50](https://github.com/seiyria/openchallenge/issues/50)
* **tournaments:** Added Masters tournaments ([7f36870](https://github.com/seiyria/openchallenge/commit/7f36870)), closes [#1](https://github.com/seiyria/openchallenge/issues/1)
* **tournaments:** Added seed functions (Shuffle, descending-score, stagger) ([e5029ab](https://github.com/seiyria/openchallenge/commit/e5029ab)), closes [#47](https://github.com/seiyria/openchallenge/issues/47)
* **tournaments:** Implemented GroupStage (round-robin, et al) ([e16adb4](https://github.com/seiyria/openchallenge/commit/e16adb4)), closes [#2](https://github.com/seiyria/openchallenge/issues/2)



<a name="0.1.0"></a>
# 0.1.0 (2015-10-05)




