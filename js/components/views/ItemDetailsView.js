import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import * as actions from "../../actions";

class ItemDetailsView extends Component {
	static navigationOptions = ({ name }) => ({ title: name });
	toggleFavourite = id => {
		this.props.dispatch(actions.toggleFavourite(id));
	};
	render() {
		const { name, isFavourite, id } = this.props;

		return (
			<View style={styles.container}>
				<Text> {name}</Text>
				{isFavourite ? (
					<Text> You like this</Text>
				) : (
					<Text>You don't like this</Text>
				)}
				<Button
					title="Toggle Favourite"
					onPress={() => this.toggleFavourite(id)}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

const mapStateToProps = (state, { navigation }) => {
	const { id } = navigation.state.params;
	return { ...state.items.byId[id], comments: state.comments[id] };
};

export default connect(mapStateToProps)(ItemDetailsView);
