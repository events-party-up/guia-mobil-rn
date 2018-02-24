import React from "react";
import { FBLogin, FBLoginManager } from "react-native-facebook-login";

import { connect } from "react-redux";
import * as actions from "../actions";

export const FacebookLoginButton = ({
	style,
	onLogin,
	onLoginFound,
	onLogout,
	onLoginNotFound
}) => (
	<FBLogin
		style={style}
		permissions={["email", "public_profile"]}
		loginBehavior={FBLoginManager.LoginBehaviors.Native}
		onLogin={onLogin}
		onLogout={onLogout}
		onLoginFound={onLoginFound}
		onLoginNotFound={onLoginNotFound}
		onError={function(data) {
			console.log("ERROR");
			console.log(data);
		}}
		onCancel={function() {
			console.log("User cancelled.");
		}}
		onPermissionsMissing={function(data) {
			console.log("Check permissions!");
			console.log(data);
		}}
	/>
);

const mapDispatchToProps = dispatch => ({
	onLogin({ credentials }) {
		console.log({ credentials });
		dispatch(actions.setFacebookCredentials(credentials));
	},
	onLogout() {
		dispatch(actions.logout());
	},
	onLoginFound({ credentials }) {
		console.log({ credentials });
		dispatch(actions.setFacebookCredentials(credentials));
	},
	onLoginNotFound() {
		dispatch(actions.logout());
	}
});

export default connect(null, mapDispatchToProps)(FacebookLoginButton);
