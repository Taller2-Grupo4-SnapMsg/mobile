"""
Clases for the response bodies of the posts and likes controller.
There are also functions to generate the correct classes from the db objects
and from the json objects.
"""
from typing import List
from fastapi import HTTPException
from pydantic import BaseModel
import httpx
import requests

POST_NOT_FOUND = 404
USER_NOT_FOUND = 404
LIKE_NOT_FOUND = 404
BAD_REQUEST = 400

API_BASE_URL = "https://gateway-api-service-merok23.cloud.okteto.net"


# ------------------------------------------ POSTS ------------------------------------------


class PostCreateRequest(BaseModel):
    """
    This class is a Pydantic model for the request body.
    """

    content: str
    image: str
    hashtags: List[str]
    mentions: List[str]


class UserResponse(BaseModel):
    """
    This class is a Pydantic model for the User part of the response body.
    This way, with the post in the response, the front already gets the information from
    the corresponding User
    """

    id: int
    email: str
    name: str
    username: str
    avatar: str


class PostResponse(BaseModel):
    """
    This class is a Pydantic model for the response body.
    """

    post_id: int
    user_poster: UserResponse
    user_creator: UserResponse
    created_at: str
    text: str
    image: str
    number_likes: int
    number_reposts: int
    hashtags: List[str]
    mentions: List[str]
    did_i_like: bool
    did_i_repost: bool

    # I disable it since it's a pydantic configuration
    # pylint: disable=too-few-public-methods
    class Config:
        """
        This is a pydantic configuration so I can cast
        orm_objects into pydantic models.
        """

        orm_mode = True
        from_attributes = True


# pylint: disable=R0913
def generate_post_from_db(
    post_info,
    content_info,
    user_poster_info,
    user_creator_info,
    hashtags,
    mentions,
    likes_count,
    reposts_count,
    did_i_like,
    did_i_repost,
):
    """
    This function casts the orm_object into a pydantic model.
    (from data base object to json)
    """
    return PostResponse(
        post_id=post_info.post_id,
        user_poster=generate_user_from_db(user_poster_info),
        user_creator=generate_user_from_db(user_creator_info),
        created_at=str(post_info.created_at),
        text=content_info.text,
        image=content_info.image,
        number_likes=likes_count,
        number_reposts=reposts_count,
        hashtags=hashtags,
        mentions=mentions,
        did_i_like=did_i_like,
        did_i_repost=did_i_repost,
    )


# listo
def generate_user_from_db(user_info):
    """
    This function casts the orm_object into a pydantic model.
    (from data base object to json)
    """

    return UserResponse(
        id=user_info.id,
        email=user_info.email,
        name=user_info.name,
        username=user_info.username,
        avatar=user_info.avatar,
    )


# listo
def generate_post(post_db):
    """
    This function casts the orm_object into a pydantic model.
    """
    (
        post_info,
        content_info,
        user_poster_info,
        user_creator_info,
        hashtags,
        mentions,
        likes_count,
        reposts_count,
        did_i_like,
        did_i_repost,
    ) = post_db

    if likes_count is None:
        likes_count = 0
    if reposts_count is None:
        reposts_count = 0
    if hashtags is None:
        hashtags = []
    if mentions is None:
        mentions = []

    return generate_post_from_db(
        post_info,
        content_info,
        user_poster_info,
        user_creator_info,
        hashtags,
        mentions,
        likes_count,
        reposts_count,
        did_i_like,
        did_i_repost,
    )


# listo
def generate_response_posts_from_db(posts_db):
    """
    This function casts the orm_object into a pydantic model.
    """
    response = []
    for post_db in posts_db:
        post = generate_post(post_db)
        response.append(post)

    return response


# ------------------------------------------ LIKES ------------------------------------------


class LikeCreateRequest(BaseModel):
    """
    This class is a Pydantic model for the request body.
    """

    content_id: int

    # pylint: disable=too-few-public-methods
    class Config:
        """
        This is a pydantic configuration so I can cast
        orm_objects into pydantic models.
        """

        orm_mode = True
        from_attributes = True


# ----------------------- NOTIFICATIONS -------------------


class NotificationRequest(BaseModel):
    """This class is a Pydantic model for the request body."""

    user_emails_that_receive: List[str]
    title: str
    body: str
    # sound: Optional[str]
    # badge: Optional[int]
    # data: Optional[dict]

    # I disable it since it's a pydantic configuration
    # pylint: disable=too-few-public-methods
    class Config:
        """
        This is a pydantic configuration so I can cast
        orm_objects into pydantic models.
        """

        orm_mode = True
        from_attributes = True


URL_EXPO = "https://exp.host/--/api/v2/push/send"

headers_expo = {
    "host": "exp.host",
    "accept": "application/json",
    "accept-encoding": "gzip, deflate",
    "content-type": "application/json",
}


def send_push_notification(token, notificacion_request):
    """
    This function send a push notification to the user
    """
    data = {
        "to": token,
        "title": notificacion_request.title,
        "body": notificacion_request.body,
        "sound": "default",
    }

    try:
        response = requests.post(URL_EXPO, headers=headers_expo, json=data, timeout=5)
        response.raise_for_status()

    except requests.exceptions.RequestException as error:
        print("Error al enviar la notificación:", str(error))


def send_push_notifications(tokens_db, notificacion_request):
    """
    This function sends a push notification to the users
    """
    device_tokens = [token.device_token for token in tokens_db]
    for device_token in device_tokens:
        send_push_notification(device_token, notificacion_request)


# ----------------- Common functions -----------------


async def get_user_from_token(token):
    """
    This function gets the user from the token.
    """
    headers = {
        "Content-Type": "application/json;charset=utf-8",
        "accept": "application/json",
        "token": token,
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{API_BASE_URL}/user", headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail={"Unknown error"})

        return response.json()
