import { useState, Fragment } from 'react'
import formFields from '../form.json' // form fields array from json file
import './App.css'

import { useForm, SubmitHandler } from 'react-hook-form'

/* Type of single form field for illustration */
// type FormField = {
//   default_value?: string | number | boolean
//   value?: string | number | boolean
//   validation?: string | RegExp
//   min_value?: number
//   max_value?: number
//   options?: string[] | number[]
//   type: 'text' | 'longtext' | 'dropdown' | 'number'
// }

type FormData = Record<string, string>

export default function App() {
  const [data, setData] = useState<FormData | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = (data) => setData(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      {/* Map form fields from json to form input fields */}
      {formFields.map((field, index) => {
        return (
          <Fragment key={field.type + index}>
            {field.type === 'dropdown' ? (
              /* Dropdown input type */
              <select
                defaultValue={(field.value || field.default_value)?.toString()}
                {...register(`${index}`, {
                  pattern: field.validation ? new RegExp(field.validation) : undefined,
                })}
              >
                {field.options?.map((opt) => (
                  <option key={`${index}-${opt}`}>{opt}</option>
                ))}
              </select>
            ) : field.type === 'longtext' ? (
              /* Longtext input type */
              <textarea
                rows={2}
                defaultValue={(field.value || field.default_value)?.toString()}
                {...register(`${index}`, {
                  pattern: field.validation ? new RegExp(field.validation) : undefined,
                  required: field.validation || field.min_value || field.max_value ? 'Field is required' : undefined,
                  min: field.min_value,
                  max: field.max_value,
                })}
              ></textarea>
            ) : (
              /* Other input types */
              <input
                type={field.type}
                defaultValue={(field.value || field.default_value)?.toString()}
                {...register(`${index}`, {
                  pattern: field.validation ? new RegExp(field.validation) : undefined,
                  required: field.validation || field.min_value || field.max_value ? 'Field is required' : undefined,
                  min: field.min_value,
                  max: field.max_value,
                })}
              ></input>
            )}

            {/* Validation error messages for every input */}
            {errors[`${index}`]?.type === 'required' && <p className="error">{errors[`${index}`]?.message}</p>}
            {errors[`${index}`]?.type === 'pattern' && (
              <p className="error">Invalid input (pattern {field.validation})</p>
            )}
            {errors[`${index}`]?.type === 'min' && <p className="error">Minimum value should be {field.min_value}</p>}
            {errors[`${index}`]?.type === 'max' && <p className="error">Maximum value should be {field.max_value}</p>}
          </Fragment>
        )
      })}

      <input type="submit" />

      {/* If there is form data - diplay it as list */}
      {data && (
        <ul className="success">
          Form values:
          {Object.values(data).map((value, index) => (
            <li key={value + index}>{value}</li>
          ))}
        </ul>
      )}
    </form>
  )
}
