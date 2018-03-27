module Page.Login exposing (Model)

{-
   Login page
-}

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


-- MODEL --


type alias Model =
    { username : String
    , password : String
    , error : String
    }


initialModel : Model
initialModel =
    { username = ""
    , password = ""
    , error = ""
    }



-- VIEW --


viewLoginForm : Model -> Html Msg
viewLoginForm model =
    Html.form []
        [ div
            [ class "field" ]
            [ div
                [ class "control" ]
                [ input
                    [ class "input is-large"
                    , placeholder "Username"
                    , value model.username
                    , onInput (SetUsername)
                    ]
                    []
                ]
            ]
        , div
            [ class "field" ]
            [ div
                [ class "control" ]
                [ input
                    [ class "input is-large"
                    , placeholder "Password"
                    , value model.password
                    , onInput SetPassword
                    ]
                    []
                ]
            ]
        , div
            [ class "field" ]
            [ button
                [ class "button is-block is-info is-large is-fullwidth" ]
                [ text "Login" ]
            ]
        ]



-- UPDATE --


type Msg
    = Login
    | SetPassword String
    | SetUsername String
