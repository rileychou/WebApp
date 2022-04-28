import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import VoterStore from '../../stores/VoterStore';
import Reassurance from '../Startup/Reassurance';
import HeaderBackToButton from '../../components/Navigation/HeaderBackToButton';
import {
  DesktopNextButtonsInnerWrapper,
  DesktopNextButtonsOuterWrapper,
  MobileStaticNextButtonsInnerWrapper,
  MobileStaticNextButtonsOuterWrapper,
} from '../../components/Style/NextButtonStyles';
import { reassuranceText } from '../../components/SetUpAccount/reassuranceText';

const logoColorOnWhite = '../../../img/global/svg-icons/we-vote-icon-square-color-dark.svg';

const SetUpAccountEditName = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountEditName' */ '../../components/SetUpAccount/SetUpAccountEditName'));
const SetUpAccountAddPhoto = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountAddPhoto' */ '../../components/SetUpAccount/SetUpAccountAddPhoto'));

class SetUpAccountRoot extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      displayStep: 1, // editName
      editNameNextButtonDisabled: true,
      nextButtonClicked: false,
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    let params = {};
    let setUpPagePath = '';
    const { match } = this.props;
    if (match) {
      ({ params } = match);
      if (params) {
        ({ set_up_page: setUpPagePath } = params);
      }
    }
    const displayStep = this.convertSetUpPagePathToDisplayStep(setUpPagePath);
    this.shouldNextButtonBeDisabled();
    this.setState({
      displayStep,
      setUpPagePath,
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    let prevParams = {};
    let prevSetUpPagePath = '';
    const { match: prevMatch } = prevProps;
    if (prevMatch) {
      ({ params: prevParams } = prevMatch);
      if (prevParams) {
        ({ set_up_page: prevSetUpPagePath } = prevParams);
      }
    }
    let params = {};
    let setUpPagePath = '';
    const { match } = this.props;
    if (match) {
      ({ params } = match);
      if (params) {
        ({ set_up_page: setUpPagePath } = params);
      }
    }
    // console.log('SetUpAccountEditName componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevSetUpPagePath !== setUpPagePath) {
      const displayStep = this.convertSetUpPagePathToDisplayStep(setUpPagePath);
      console.log('SetUpAccountRoot componentDidUpdate displayStep:', displayStep);
      this.shouldNextButtonBeDisabled();
      this.setState({
        displayStep,
        setUpPagePath,
      });
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.resetNextButtonClicked();
    this.shouldNextButtonBeDisabled();
    const { setUpPagePath } = this.state;
    const displayStep = this.convertSetUpPagePathToDisplayStep(setUpPagePath);
    this.setState({
      displayStep,
    });
  }

  convertSetUpPagePathToDisplayStep = (setUpPagePath) => {
    let displayStep;
    switch (setUpPagePath) {
      default:
      case 'editname':
        displayStep = 1;
        break;
      case 'addphoto':
        if (VoterStore.getVoterProfileUploadedImageUrlLarge()) {
          // This turns off the reassurance text
          displayStep = 3;
        } else {
          displayStep = 2;
        }
        break;
    }
    return displayStep;
  }

  onClickNextButton = () => {
    this.setState({
      nextButtonClicked: true,
    });
  }

  getBackToLink = () => {
    const { displayStep } = this.state;
    let backToLink = '';
    switch (displayStep) {
      default:
      case 1:
        backToLink = '';
        break;
      case 2: // 'addPhoto'
      case 3:
        backToLink = '/setupaccount/editname';
        break;
    }
    // console.log('SetUpAccountRoot getBackToLink:', backToLink);
    return backToLink;
  }

  goToNextStep = () => {
    this.resetNextButtonClicked();
    const { displayStep } = this.state;
    switch (displayStep) {
      default:
      case 1: // 'editName'
        historyPush('/setupaccount/addphoto');
        break;
    }
  }

  goToSkipForNow = () => {
    console.log('goToSkipForNow');
  }

  resetNextButtonClicked = () => {
    this.setState({
      nextButtonClicked: false,
    });
  }

  shouldNextButtonBeDisabled = () => {
    let voterEmailMissing = false;
    let voterFirstNameMissing = false;
    let voterPhotoMissing = false;
    const voterFirstNameQueuedToSave = VoterStore.getVoterFirstNameQueuedToSave();
    const voterIsSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    const voterEmailQueuedToSave = VoterStore.getVoterEmailQueuedToSave();
    const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
    if (!voterIsSignedInWithEmail && !voterEmailQueuedToSave) {
      voterEmailMissing = true;
    }
    if (!voterFirstNameQueuedToSave && !VoterStore.getFirstName()) {
      voterFirstNameMissing = true;
    }
    if (!voterPhotoQueuedToSave && !VoterStore.getVoterProfileUploadedImageUrlLarge()) {
      voterPhotoMissing = true;
    }
    this.setState({
      addPhotoNextButtonDisabled: voterPhotoMissing,
      editNameNextButtonDisabled: voterEmailMissing || voterFirstNameMissing,
    });
  }

  render () {
    renderLog('SetUpAccountRoot');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { addPhotoNextButtonDisabled, displayStep, editNameNextButtonDisabled, nextButtonClicked } = this.state;
    // console.log('SetUpAccountRoot displayState', displayStep);

    let backButtonOn;
    let nextButtonDisabled = true;
    let stepHtml;
    switch (displayStep) {
      default:
      case 1:
        backButtonOn = false;
        nextButtonDisabled = editNameNextButtonDisabled;
        stepHtml = (
          <Suspense fallback={<></>}>
            <SetUpAccountEditName
              functionToUseWhenProfileComplete={this.goToNextStep}
              functionToUseWhenProfileNotComplete={this.resetNextButtonClicked}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
      case 2:
      case 3:
        backButtonOn = true;
        nextButtonDisabled = addPhotoNextButtonDisabled;
        stepHtml = (
          <Suspense fallback={<></>}>
            <SetUpAccountAddPhoto
              functionToUseWhenProfileComplete={this.goToNextStep}
              functionToUseWhenProfileNotComplete={this.resetNextButtonClicked}
              nextButtonClicked={nextButtonClicked}
            />
          </Suspense>
        );
        break;
    }

    const desktopButtonHtml = (
      <>
        <Button
          color="primary"
          disabled={nextButtonDisabled}
          onClick={this.onClickNextButton}
          style={{
            boxShadow: 'none !important',
            textTransform: 'none',
            width: 150,
          }}
          variant="contained"
        >
          Next
        </Button>
        <Button
          classes={{ root: classes.desktopSimpleLink }}
          color="primary"
          onClick={this.goToSkipForNow}
        >
          Skip for now
        </Button>
      </>
    );

    const mobileButtonHtml = (
      <>
        <Button
          color="primary"
          disabled={nextButtonDisabled}
          onClick={this.onClickNextButton}
          style={{
            boxShadow: 'none !important',
            textTransform: 'none',
            width: '100%',
          }}
          variant="contained"
        >
          Next
        </Button>
        <Button
          classes={{ root: classes.mobileSimpleLink }}
          color="primary"
          onClick={this.goToSkipForNow}
        >
          Skip for now
        </Button>
      </>
    );

    return (
      <PageContentContainerAccountSetUp>
        <AccountSetUpRootWrapper>
          <WeVoteLogoWrapper>
            <WeVoteLogo
              src={normalizedImagePath(logoColorOnWhite)}
              height="48"
              width="48"
            />
          </WeVoteLogoWrapper>
          <BackWrapper>
            {backButtonOn ? (
              <HeaderBackToButton
                backToLink={this.getBackToLink()}
                id="accountSetUpBackTo"
                leftAligned
              />
            ) : (
              <BackToButtonSpacer />
            )}
          </BackWrapper>
          <StepHtmlWrapper>
            {stepHtml}
          </StepHtmlWrapper>
          <DesktopNextButtonsOuterWrapper className="u-show-desktop-tablet">
            <DesktopNextButtonsInnerWrapper>
              {desktopButtonHtml}
            </DesktopNextButtonsInnerWrapper>
          </DesktopNextButtonsOuterWrapper>
          <Reassurance displayState={displayStep} reassuranceText={reassuranceText} />
        </AccountSetUpRootWrapper>
        <MobileStaticNextButtonsOuterWrapper className="u-show-mobile">
          <MobileStaticNextButtonsInnerWrapper>
            {mobileButtonHtml}
          </MobileStaticNextButtonsInnerWrapper>
        </MobileStaticNextButtonsOuterWrapper>
      </PageContentContainerAccountSetUp>
    );
  }
}
SetUpAccountRoot.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  desktopSimpleLink: {
    boxShadow: 'none !important',
    color: '#999',
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
  mobileSimpleLink: {
    boxShadow: 'none !important',
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: '100%',
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
});

const AccountSetUpRootWrapper = styled('div')`
  background-color: white;
  max-width: 550px;
  padding: 40px 20px 110% 20px;
`;

const BackWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
  margin-bottom: 4px;
`;

const BackToButtonSpacer = styled('div')`
  margin-bottom: 36px;
`;

export const PageContentContainerAccountSetUp = styled('div')`
  background-color: white;
  display: flex;
  justify-content: center;
`;

const StepHtmlWrapper = styled('div')`
`;

const WeVoteLogo = styled('img')`
`;

const WeVoteLogoWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 35px;
`;

export default withStyles(styles)(SetUpAccountRoot);