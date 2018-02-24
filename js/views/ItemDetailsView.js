// @flow
import React, { Component } from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	Dimensions,
	ScrollView
} from "react-native";
import { connect } from "react-redux";
import { Button, Icon } from "react-native-elements";
import * as actions from "../actions";
import CommentsView from "./CommentsView";
import { IItem } from "../models";
import Header from "../components/Header";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").width;
const IMAGE_HEIGHT = 300;
interface Props extends IItem {
	isFavourite: boolean;
	dispatch: Function;
}

const lakeImage =
	"https://upload.wikimedia.org/wikipedia/commons/2/22/Lago_Nahuel_Huapi%2C_Argentina%2C_2005.jpeg";
class ItemDetailsView extends Component<Props> {
	static navigationOptions = ({ name }) => ({
		title: name,
		header: null
	});
	toggleFavourite = id => {
		this.props.dispatch(actions.toggleFavourite(id));
	};

	renderInfoItem = (iconName, text) => {
		if (text) {
			return (
				<View style={styles.contactRow}>
					<Icon
						type="material-community"
						style={styles.contactRowIcon}
						name={iconName}
					/>
					<Text> {text} </Text>
				</View>
			);
		}
		return null;
	};

	render() {
		const {
			name,
			description,
			isFavourite,
			id,
			image,
			phone,
			mail,
			address
		} = this.props;
		const favouriteIcon = require("./img/favorite.png");
		const favouriteIconOutline = require("./img/favorite-outline.png");
		const rightItem = {
			title: "Settings",
			layout: "icon",
			icon: isFavourite ? favouriteIcon : favouriteIconOutline,
			onPress: () => this.toggleFavourite(id)
		};

		return (
			<View style={styles.container}>
				<ScrollView style={styles.scrollView} bounces={false}>
					<Image
						source={{
							uri: image
								? `https://bariloche.guiasmoviles.com/uploads/${image}`
								: lakeImage
						}}
						style={{
							width: WINDOW_WIDTH,
							height: IMAGE_HEIGHT
						}}
					/>

					<Text style={styles.title}> {name.toUpperCase()}</Text>
					<View style={styles.actionItems}>
						<Button title={"LLamar"} />
						<Button title={"Ver en mapa"} />
					</View>
					<View style={styles.contactItems}>
						{this.renderInfoItem("phone", phone)}
						{this.renderInfoItem("email", mail)}
						{this.renderInfoItem("map-marker", address)}
					</View>
					<Text style={styles.description}> {description} </Text>
					{isFavourite ? (
						<Text> You like this</Text>
					) : (
						<Text>{"You don't like this"}</Text>
					)}
					<MapboxGL.MapView
						styleURL={MapboxGL.StyleURL.Street}
						centerCoordinate={this.props.coord}
						zoomLevel={16}
						height={200}
						zoomEnabled={false}
						scrollEnabled={false}
						rotateEnabled={false}
					/>
					<View>
						<Text>Evaluaciones</Text>
					</View>
					<CommentsView itemId={id} />
				</ScrollView>
				<View style={styles.headerContainer}>
					<Header
						backgroundColor="transparent"
						navItem={{ back: true }}
						rightItem={rightItem}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	headerContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0
	},
	scollView: {
		position: "absolute",
		height: WINDOW_HEIGHT
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
	},
	contactItems: {
		margin: 10
	},
	contactRow: {
		flexDirection: "row",
		alignItems: "center"
	},
	contactRowIcon: {
		width: 40,
		height: 40,
		borderWidth: 1,
		marginRight: 30
	},
	actionItems: {
		flexDirection: "row",
		justifyContent: "space-around"
	}
});

const mapStateToProps = (state, { navigation }) => {
	const { id } = navigation.state.params;
	return { ...state.items.byId[id], comments: state.comments[id] };
};

export default connect(mapStateToProps)(ItemDetailsView);
