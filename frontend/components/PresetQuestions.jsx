"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { Button } from "./ui/buttons"
import { Card, CardContent } from "./ui/card"
import { Slider } from "./ui/slider"
import { Input } from "./ui/input"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"
import { getQuestions } from "../api"

const initialQuestions = [
  {
    id: 1,
    text: "What do you feel like eating today?",
    type: "multipleChoiceWithOther",
    options: ["Chinese", "Japanese", "Indian", "French"],
  },
  {
    id: 2,
    text: "How long do you have to cook? (in minutes)",
    type: "slider",
    options: { min: 15, max: 120, step: 15 },
  },
  {
    id: 3,
    text: "Do you want to spice up your food?",
    type: "multipleChoice",
    options: ["Yes", "No"],
  },
]


function DynamicForm() {
  const [questions] = useState(initialQuestions)
  const [answers, setAnswers] = useState({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [direction, setDirection] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [otherInput, setOtherInput] = useState("")


  useEffect(() => {
    getQuestions().then((res) => console.log(res))
  }, [])

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
    if (answer !== "Other") {
      setOtherInput("")
    }
  }

  const handleOtherInputChange = (questionId, value) => {
    setOtherInput(value)
    setAnswers((prev) => ({ ...prev, [questionId]: `Other: ${value}` }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log("Form submitted with answers:", answers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setDirection("forward")
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection("backward")
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1)
      }, 300)
    }
  }

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const renderQuestion = (question) => {
    if (question.type === "multipleChoice" && Array.isArray(question.options)) {
      return (
        <RadioGroup
          value={answers[question.id]?.toString() || ""}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option}
                id={`q${question.id}-option${index}`}
                className="border-2 border-red-500 text-red-500"
              />
              <Label htmlFor={`q${question.id}-option${index}`} className="text-sm cursor-pointer text-gray-800">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )
    } else if (question.type === "multipleChoiceWithOther" && Array.isArray(question.options)) {
      return (
        <RadioGroup
          value={answers[question.id]?.toString() || ""}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          className="space-y-2"
        >
          {[...question.options, "Other"].map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option}
                id={`q${question.id}-option${index}`}
                className="border-2 border-red-500 text-red-500"
              />
              <Label htmlFor={`q${question.id}-option${index}`} className="text-sm cursor-pointer text-gray-800">
                {option}
              </Label>
            </div>
          ))}
          {answers[question.id] === "Other" && (
            <Input
              type="text"
              placeholder="Please specify"
              value={otherInput}
              onChange={(e) => handleOtherInputChange(question.id, e.target.value)}
              className="mt-2 text-sm border-red-500 focus:ring-red-500"
            />
          )}
        </RadioGroup>
      )
    } else if (question.type === "slider" && typeof question.options === "object") {
      const { min, max, step } = question.options
      return (
        <div className="space-y-4 flex flex-col items-center w-full">
          <Slider
            min={min}
            max={max}
            step={step}
            value={[answers[question.id] || min]}
            onValueChange={(value) => handleAnswerChange(question.id, value[0])}
            className="w-full"
          />
          <div className="text-center text-sm font-medium text-red-500">{answers[question.id] || min} minutes</div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full h-full max-w-[400px] mx-auto bg-white shadow-lg overflow-hidden border border-red-500">
      <CardContent className="p-4 h-full flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
          <div className="relative flex-grow overflow-hidden">
            <div
              className={`absolute w-full h-full transition-all duration-600 ease-in-out ${isTransitioning
                  ? direction === "forward"
                    ? "-translate-x-full opacity-0"
                    : "translate-x-full opacity-0"
                  : "translate-x-0 opacity-100"
                }`}
            >
              <h2 className="text-xl font-bold mb-2 text-black">{currentQuestion.text}</h2>
              <div className="relative h-1 bg-red-100 rounded-full overflow-hidden mb-4">
                <div
                  className="absolute h-full bg-red-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {renderQuestion(currentQuestion)}
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || isTransitioning}
              variant="outline"
              className="w-[80px] h-8 text-xs bg-red-500 text-white hover:bg-red-600"
              style={{ opacity: currentQuestionIndex === 0 ? 0 : 1 }}
            >
              <ChevronLeft className="mr-1 h-3 w-3" /> Previous
            </Button>
            <div className="text-xs font-medium text-red-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            {!isLastQuestion ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!answers[currentQuestionIndex + 1] || isTransitioning}
                className="w-[80px] h-8 text-xs bg-red-500 text-white hover:bg-red-700"
              >
                Next <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={Object.keys(answers).length !== questions.length}
                className="w-[80px] h-8 text-xs bg-red-500 text-white hover:bg-red-600"
              >
                Submit <Send className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default DynamicForm



