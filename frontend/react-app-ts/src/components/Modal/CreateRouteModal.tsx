import React, {FormEvent, useReducer} from "react";
import {ModalBase} from "./ModalBase";
import styled from "styled-components";
import {TourRouteHook} from "../../hooks/useTourRoute";
import {DefaultModalProps} from "../../hooks/useModal";
import {AxiosResponse} from "axios";


type FormErrors = null | {
    title?: String[],
    description?: String[]
}

type State = {
    title: string,
    description: string,
    isLoading: boolean,
    errorMessage: string,
    errors: FormErrors,
}

const initialState: State = {
    title: "",
    description: "",
    isLoading: false,
    errorMessage: "",
    errors: null
};

type FieldChangeAction = {
    type: "CHANGE"
    fieldname: string
    payload: string
}

type SubmitAction = {
    type: "SUBMIT"
}

type SetErrorsAction = {
    type: "ERROR",
    errors: FormErrors
}

type Action = FieldChangeAction | SubmitAction | SetErrorsAction

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case "CHANGE":
            return {
                ...state,
                [action.fieldname]: action.payload
            };

        case "ERROR":
            console.log("Form error: ", action);
            return {
                ...state,
                errors: action.errors
            };

        case "SUBMIT":
            console.log("Submit!!");
            return {
                ...state,
                errors: null
            };

    }
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.5rem;
    font-weight: lighter;

    .error-msg {
      color: red;
      font-weight: bold;
    }
  }

  input, textarea {
    transition: 0.3s;
    width: 100%;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid;
    border-color: gainsboro;
    margin-bottom: 1rem;
    padding: 0.5rem;
    font-weight: normal;
    color: #202329;
    //font-family: "Roboto",serif;

    :focus {
      outline: none;
      box-shadow: 0 0 1pt 2pt #00d9d9;
    }
  }

  input.error {
    border-color: #ff0000;
    border-width: 1px;
    box-shadow: 0 0 1pt 2pt red;
  }

  button {
    transition: 0.3s;
    width: 100%;
    cursor: pointer;
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 5px;
    background: darkcyan;
    color: #fefefe;
    font-size: 16pt;
    text-transform: uppercase;
    font-family: "Roboto Medium", serif;

    :focus {
      outline: none;
      box-shadow: 0 0 1pt 2pt cyan;
    }

    :active {
      background: cyan;
      color: white;
    }
  }
`;

export type CreateRouteModalProps = DefaultModalProps & {
    routeHook?: TourRouteHook
}

export const CreateRouteModal: React.FC<CreateRouteModalProps> = ({closeModal, routeHook}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {title, description, errors} = state;

    const formRef = React.createRef<HTMLFormElement>();

    const onChangeField = (ev: { target: HTMLInputElement | HTMLTextAreaElement }) => dispatch({
        type: "CHANGE",
        fieldname: ev.target.name,
        payload: ev.target.value
    });

    const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        console.log(ev);

        dispatch({
            type: "SUBMIT"
        });

        routeHook?.createRoute({
            title: state.title,
            description: state.description
        })
            .then((value) => {
                console.log("CreateRouteModal: ", value);
                closeModal?.call(this);
            })
            .catch((response: AxiosResponse) => {
                console.log("Modal error: ", response);
                onError(response.data);
            });
    };

    const onError = (error: FormErrors) => dispatch({
        type: "ERROR",
        errors: error
    });

    console.log("formRef: ", formRef);

    return (
        <ModalBase modalTitle={"Создать новый тур"}>
            <StyledForm ref={formRef} onSubmit={onSubmit} onMouseEnter={() => console.log(formRef.current)}>
                <label>
                    Название:
                    <input
                        className={errors && "title" in errors ? "error" : ""}
                        name="title"
                        type="text"
                        value={title}
                        onChange={onChangeField}/>

                    {errors?.title &&
                    errors.title.map((msg, i) => <p key={i} className={"error-msg"}>{msg}</p>)
                    }
                </label>

                <label>
                    Описание:
                    <textarea
                        className={errors && "description" in errors ? "error" : ""}
                        name="description"
                        value={description}
                        onChange={onChangeField}/>
                </label>
                {errors?.description &&
                errors.description.map((msg, i) => <p key={i} className={"error-msg"}>{msg}</p>)
                }

                <button type="submit">Создать</button>
            </StyledForm>
        </ModalBase>
    );
};
