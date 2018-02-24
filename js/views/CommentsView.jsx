import React from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";

export const CommentsView = ({ comments }) => (
	<View>
		{comments.map(comment => (
			<View key={comment.key}>
				<Text>{comment.text}</Text>
				<Text>{comment.createdAt}</Text>
			</View>
		))}
	</View>
);

CommentsView.propTypes = {
	itemId: PropTypes.number.isRequired,
	comments: PropTypes.array.isRequired
};

const mapStateToProps = (state, { itemId }) => {
	return {
		comments: state.comments[itemId] || []
	};
};

export default connect(mapStateToProps)(CommentsView);
