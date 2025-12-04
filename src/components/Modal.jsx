import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from '@phosphor-icons/react';
import clsx from 'clsx';

const Modal = ({ isOpen, onClose, title, children, headerColor = 'bg-slate-900' }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                                <div className={clsx(headerColor, "p-6 flex justify-between items-center text-white")}>
                                    <Dialog.Title as="h3" className="text-xl font-bold leading-6">
                                        {title}
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="text-white/70 hover:text-white transition focus:outline-none"
                                        onClick={onClose}
                                    >
                                        <X className="text-2xl" />
                                    </button>
                                </div>
                                <div className="p-8">
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
