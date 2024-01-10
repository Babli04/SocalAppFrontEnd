import { actions } from "./redux";

export const editPostGlobal = (dispatch, type, editedPost) => {
    dispatch(actions.editPost({ type, editedPost }));
  
    fetch(`https://localhost:7186/posts/${editedPost.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedPost),
    })
      .then((response) => response.json())
      .then((data) => console.log('Bejegyzésed sikeresen frissítve:', data))
      .catch((error) => console.error('Hiba a frissítés során:', error));
  };
  
  export const deletePostGlobal = (dispatch, type, postId) => {
    dispatch(actions.deletePost({ type, postId }));

    fetch(`https://localhost:7186/posts/${postId}`, {
      method: 'DELETE',
    })
      .then(() => console.log('Sikeresen törölted a bejegyzésed!'))
      .catch((error) => console.error('Hiba a törlés során:', error));
  };
  