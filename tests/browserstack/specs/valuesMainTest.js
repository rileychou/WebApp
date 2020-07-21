const assert = require('assert');
const { simpleClick, selectClick, simpleTextInput, selectTextInput, scrollIntoViewSimple, scrollIntoViewSelect } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 250;

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run tests', async () => {
    const { isCordovaFromAppStore, isMobileScreenSize } = driver.config.capabilities;
    const WEB_APP_ROOT_URL = driver.config.webAppRootUrl;
    const isDesktopScreenSize = !isMobileScreenSize;
    const xssTest = '<script>alert(1)</script>';
    const publicFigureOrOrganizationFollowSelector = '[id^=positionItemFollowToggleFollow-undefined-wv02org]';
    const publicFigureOrOrganizationDropDownSelector = '[id^=positionItemFollowToggleDropdown-undefined-wv02org]';
    const publicFigureOrOrganizationUnfollowSelector = '[id^=positionItemFollowToggleUnfollow-undefined-wv02org]';
    const publicFigureOrOrganizationIgnoreSelector = '[id^=positionItemFollowToggleIgnore-undefined-wv02org]';
    const publicFigureOrOrganizationUnignoreSelector = '[id^=positionItemFollowToggleStopIgnoring-undefined-wv02org]';
    const organizationSection = '#mainContainer:nth-child(4)';

    if (isCordovaFromAppStore) {
    // ///////////////////////////////
    // For the apps downloadable from either the Apple App Store or Android Play Store,
    // click through the onboarding screens
      await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
      const contexts = await driver.getContexts();
      const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
      await driver.switchContext(context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const firstNextButton = await $('div[data-index="0"] .intro-story__btn--bottom');
      await firstNextButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const secondNextButton = await $('div[data-index="1"] .intro-story__btn--bottom');
      await secondNextButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const thirdNextButton = await $('div[data-index="2"] .intro-story__btn--bottom');
      await thirdNextButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
    // ///////////////////////////////
    // For the website version, open our quality testing site
      await browser.url('values');
    }

    // //////////////////////
    // Test "Public Figures to Follow" section
    await browser.pause(PAUSE_DURATION_MICROSECONDS * 10);
    await simpleClick('publicFiguresToFollowPreviewShowMoreId'); // Click "Explore more public figures"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await selectClick(publicFigureOrOrganizationFollowSelector); // Follow public figure
    await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
//    await selectClick(publicFigureOrOrganizationUnfollowSelector); // Unfollow endorsement
//    await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
//    await selectClick(publicFigureOrOrganizationFollowSelector); // Follow endorsement
    await simpleClick('organizationOrPublicFigureLink'); // Click public figure link
    await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
    await selectClick(publicFigureOrOrganizationUnfollowSelector); // Unfollow endorsement
    await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
    await selectClick(publicFigureOrOrganizationIgnoreSelector); // Click ignore button
    await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
    await selectClick(publicFigureOrOrganizationUnignoreSelector); // Click unignore button
    await simpleClick('readMore'); // Clicks "More"
    await simpleClick('showLess'); // Clicks "Show Less"
    await browser.back(); // Return to values page

    // //////////////////////
    // Tests organizations to follow
    await scrollIntoViewSimple('organizationsSection'); // Scrolls to "Organizations to Follow"
    await simpleClick('readMore'); // Clicks "More"
    await simpleClick('showLess'); // Clicks "Show Less"
    await simpleClick('organizationsToFollowPreviewShowMoreId'); // Clicks on "Explore more organizations"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await scrollIntoViewSimple('organizationsSection'); // Scrolls to "Organizations to Follow"
    await selectClick(`${organizationSection} #organizationOrPublicFigureLink`); // Click organization link
    await browser.back(); // Return to values page
    /* Used to circumvent odd behavior in which web page does not load recommendations */
    await simpleClick('publicFiguresToFollowPreviewShowMoreId'); // Click "Explore more public figures"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await scrollIntoViewSimple('organizationsSection'); // Scrolls to "Organizations to Follow"
    await selectClick(`${organizationSection} ${publicFigureOrOrganizationFollowSelector}`); // Click organization link
    /*  Use if organization does not disappear after clicking follow */
    //  publicFigureOrOrganizationDropDown = await $(`${organizationSection} ${publicFigureOrOrganizationDropDownSelector}`);
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    //  publicFigureOrOrganizationUnfollow = await $(`${organizationSection} ${publicFigureOrOrganizationUnfollowSelector}`);
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    //  await publicFigureOrOrganizationUnfollow.click(); // Unfollow endorsement
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationFollow.click(); // Follow endorsement
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    //  await publicFigureOrOrganizationUnfollow.click(); // Unfollow endorsement
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    //  await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  publicFigureOrOrganizationIgnore = await $(`${organizationSection} ${publicFigureOrOrganizationIgnoreSelector}`);
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationIgnore.click(); // Click ignore button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  publicFigureOrOrganizationUnignore = await $(`${organizationSection} ${publicFigureOrOrganizationUnignoreSelector}`);
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationUnignore.click(); // Click "Unignore"
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Test "Values to Follow" section
    assert(false);
    await scrollIntoViewSelect('.opinions-followed__container:nth-child(3) .ValuesToFollowPreview__SectionTitle-mzp2gl-2'); // Scrolls to "Values to Follow"
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button'); // Click dropdown button
    await simpleClick('unfollowValue'); // Unfollow value
    await simpleClick('valueLink'); // Clicks on value
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button'); // Click dropdown button
    await simpleClick('unfollowValue'); // Unfollow value
    const noEndorsementsCheck = await $('#noEndorsements');
    if (await noEndorsementsCheck.isExisting()) { // Check for Endorsements
      const returnUrl = await browser.getUrl(); // Get current url
      await simpleClick('addEndorsements'); // Click "Add Endorsements"
      await browser.url(returnUrl); // Return to previous page
    } else {
      await selectClick(publicFigureOrOrganizationFollowSelector); // Follow endorsement
      await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
      await selectClick(publicFigureOrOrganizationUnfollowSelector); // Unfollow endorsement
      await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
      await selectClick(publicFigureOrOrganizationFollowSelector); // Follow endorsement
      await selectClick(publicFigureOrOrganizationUnfollowSelector); // Unfollow endorsement
      await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
      await selectClick(publicFigureOrOrganizationIgnoreSelector); // Click ignore button
      await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
      await selectClick(publicFigureOrOrganizationUnignoreSelector); // Click unignore button
      await simpleClick('readMore'); // Clicks "More"
      await simpleClick('showLess'); // Clicks "Show Less"
    }
    await scrollIntoViewSimple('valuesListTitle'); // Scrolls to "Explore More Values"
    const valueFollow = await $$('issueFollowButton')[1];
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    if (valueFollow) {
      await valueFollow.click(); // Follow value
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('toggle-button'); // Click dropdown button // click dropdown button
      await simpleClick('unfollowValue'); // Unfollow value
    }
    await simpleClick('valueListLink'); // Clicks on value
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await simpleClick('valuesToFollowPreviewShowMoreId'); // Clicks on "Explore all values"
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button'); // Click dropdown button
    await simpleClick('unfollowValue'); // Unfollow value
    await simpleTextInput('search_input', xssTest); // Test for xss
    await simpleClick('search-clear'); // Clear search
    await simpleTextInput('search_input', xssTest); // Test for xss
    await simpleClick('search'); // Click search icon
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"

  });
});

