import React, {FormEvent, useReducer} from "react";
import {ModalBase} from "./ModalBase";
import styled from "styled-components";


type State = {
    title: string,
    description: string,
    isLoading: boolean,
    errorMessage: string,
}


const initialState: State = {
    title: "",
    description: "",
    isLoading: false,
    errorMessage: ""
};

type FieldChangeAction = {
    type: "CHANGE"
    fieldname: string
    payload: string
}

type SubmitAction = {
    type: "SUBMIT"
}

type Action = FieldChangeAction | SubmitAction

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case "CHANGE":
            return {
                ...state,
                [action.fieldname]: action.payload
            };

        case "SUBMIT":
            console.log("Submit!!");
            return state;
    }
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.5rem;
    font-weight: lighter;
  }

  input, textarea {
    transition: 0.3s;
    width: 100%;
    border-radius: 5px;
    border: 1px solid gainsboro;
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
    font-family: "Roboto Medium",serif;
    
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

export const CreateRouteModal: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {title, description, isLoading, errorMessage} = state;

    const onChangeField = (ev: { target: HTMLInputElement | HTMLTextAreaElement }) => dispatch({
        type: "CHANGE",
        fieldname: ev.target.name,
        payload: ev.target.value
    });

    const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        console.log(ev);
    };

    return (
        <ModalBase modalTitle={"Создать новый тур"}>
            <StyledForm onSubmit={onSubmit}>
                <label>
                    Название:
                    <input
                        name="title"
                        type="text"
                        value={title}
                        onChange={onChangeField}/>
                </label>

                <label>
                    Описание:
                    <textarea
                        name="description"
                        value={description}
                        onChange={onChangeField}/>
                </label>

                <button type="submit">Создать</button>
            </StyledForm>
        </ModalBase>
    );
};
