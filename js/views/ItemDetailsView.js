// @flow
import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import * as actions from "../actions";
import CommentsView from "./CommentsView";
import { IItem } from "../models";

interface Props extends IItem {
	isFavourite: boolean;
	dispatch: Function;
}

class ItemDetailsView extends Component<Props> {
	static navigationOptions = ({ name }) => ({
		title: name,
		header: null
	});
	toggleFavourite = id => {
		this.props.dispatch(actions.toggleFavourite(id));
	};
	render() {
		const { name, description, isFavourite, id } = this.props;

		return (
			<View style={styles.container}>
				<View style={styles.topBar}>
					<Button
						title="Toggle Favourite"
						onPress={() => this.toggleFavourite(id)}
					/>
				</View>
				<Text style={styles.title}> {name.toUpperCase()}</Text>
				<Text style={styles.description}> {description} </Text>
				{isFavourite ? (
					<Text> You like this</Text>
				) : (
					<Text>{"You don't like this"}</Text>
				)}

				<CommentsView itemId={id} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 10
	},
	title: {
		padding: 10,
		fontSize: 20
	},
	description: {
		color: "#939393",
		padding: 10
	},
	topBar: {
		height: 40,
		padding: 10
	}
});

const mapStateToProps = (state, { navigation }) => {
	const { id } = navigation.state.params;
	return { ...state.items.byId[id], comments: state.comments[id] };
};

export default connect(mapStateToProps)(ItemDetailsView);
