"use client"
import React, { useEffect, useState } from 'react';
import { Phone, MessageSquare, ArrowRight, Shield } from 'lucide-react';
import axios from 'axios';

interface AuthFormProps {
  onAuthSuccess: (token: string | null, phoneNumber: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isSendSMSButtonDisabled, setIsSendSMSButtonDisabled] = useState(false)

  useEffect(() => {
    if (timeLeft === null) {
      return;
    }

    if (timeLeft === 0) {
      setIsSendSMSButtonDisabled(false)
      setTimeLeft(null)
    }

    const intervalID = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearInterval(intervalID)
  }, [timeLeft])

  const formatRemainingTimeLeft = (time: number | null) => {
    if (time === null) {
      return "1:00"
    }
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const sendSms = async (): Promise<{ message: string } | null> => {
    try {
      const res = await axios.post(`api/send-sms`, {
        phoneNumber: phoneNumber,
      });

      setTimeLeft(60)
      setIsSendSMSButtonDisabled(true)
      return res.data;
    } catch {
      return null;
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber || phoneNumber.length < 12) {
      setError('Введите корректный номер телефона');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`api/send-sms`, {
        phoneNumber: phoneNumber,
      });
      if (response.status == 200 && response.data.message == "Успех") {
        setStep('code')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message ?? "Ошибка при отправке смс")
      } else {
        setError("Ошибка при отправке смс")
      }
    }

    setIsLoading(false)
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const code = smsCode.join('');
    if (!code || code.length !== 6) {
      setError('Введите 6-значный код из SMS');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/sms-verification', {
        phoneNumber: phoneNumber,
        code: code,
      })
      if (response.status == 200 && response.data.status == "Успех") {
        onAuthSuccess(response.data.token, phoneNumber)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message ?? "Ошибка проверки кода")
      }
    }

    setIsLoading(false)
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+(${match[1]}) ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 12) {
      setPhoneNumber(value);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 1) {
      const newCode = [...smsCode];
      newCode[index] = numericValue;
      setSmsCode(newCode);

      // Автоматический переход к следующему полю
      if (numericValue && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Обработка Backspace для перехода к предыдущему полю
    if (e.key === 'Backspace' && !smsCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length === 6) {
      setSmsCode(pastedData.split(''));
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-4 shadow-lg shadow-green-200">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Вход в систему
          </h1>
          <p className="text-gray-600">
            {step === 'phone'
              ? 'Введите номер телефона для получения SMS-кода'
              : 'Введите код из SMS для входа в систему'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-3xl shadow-xl shadow-green-100 p-8 border border-green-100">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Phone size={16} className="mr-2 text-green-500" />
                  Номер телефона
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formatPhoneNumber(phoneNumber)}
                    onChange={handlePhoneChange}
                    placeholder="+(992) 12-345-67-89"
                    className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none bg-gray-50 focus:bg-white text-lg"
                    required
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              {isSendSMSButtonDisabled && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">Вам уже было отправлено спс подождите {formatRemainingTimeLeft(timeLeft)} секунд</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || isSendSMSButtonDisabled}
                className={`w-full flex items-center justify-center px-6 py-4 font-semibold rounded-xl transition-all duration-200 ${isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Отправляем SMS...
                  </div>
                ) : (
                  <>
                    Получить SMS-код
                    <ArrowRight size={20} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">
                  SMS-код отправлен на номер<br />
                  <span className="font-semibold text-gray-800">
                    {formatPhoneNumber(phoneNumber)}
                  </span>
                </p>
              </div>

              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <MessageSquare size={16} className="mr-2 text-green-500" />
                  SMS-код
                </label>
                <div className="flex justify-center gap-3" onPaste={handlePaste}>
                  {smsCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none bg-gray-50 focus:bg-white text-xl text-center font-mono font-semibold"
                      maxLength={1}
                      required
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Переотправить смс можно  {timeLeft
                    ? `через ${formatRemainingTimeLeft(timeLeft)}`
                    : <a
                      href="#"
                      className="text-blue-500"
                      onClick={() => sendSms()}>
                      уже сейчас
                    </a>
                  }
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center px-6 py-4 font-semibold rounded-xl transition-all duration-200 ${isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300'
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Проверяем код...
                    </div>
                  ) : (
                    <>
                      Войти
                      <ArrowRight size={20} className="ml-2" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setSmsCode(['', '', '', '', '', '']);
                    setError('');
                  }}
                  className="w-full px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Изменить номер телефона
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Нажимая "Получить SMS-код", вы соглашаетесь с{' '}
            <a href="#" className="text-green-600 hover:text-green-700 underline">
              условиями использования
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
