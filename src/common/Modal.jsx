import React from 'react'

function Modal({ body=<p>Modal</p>, showControls = true, onCancel=()=>{}, onConfirm = ()=>{}, confirmBtnText = 'Confirm' }) {
    const outsideTouchHandler = (e) => {
        if(e.target.id === e.currentTarget.id){
            onCancel();
        }
    }
    return (
    <div onClick={outsideTouchHandler} id='modal' className="fixed top-0 left-0 flex w-screen h-screen items-center justify-center backdrop-blur backdrop-brightness-90">
        <div className="flex w-max max-w-xl flex-col gap-4 rounded-xl bg-white p-4 shadow">
            <div className="flex items-center gap-4">
                {body}
            </div>
            <div className="flex justify-end gap-2">
                <button onClick={onCancel} className="rounded-md px-3 py-1 border hover:bg-slate-100">Cancel</button>
                <button onClick={onConfirm} className="rounded-md px-3 py-1 bg-indigo-500 text-white active:bg-indigo-600">{confirmBtnText}</button>
            </div>
        </div>
    </div>
  )
}

export default Modal