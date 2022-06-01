import { Box, Button, Step, StepLabel, Stepper, Typography } from '@mui/material';
import React from 'react'

type Props = {}

const steps = ['Основное', 'Начало игры', 'Ячейки', 'Слова'];

const StepMain = () => {
  return (
    <>
    <Typography
      sx={{
        color: 'primary.contrastText',
        mb: 1
      }}
    >
        Игровое поле состоит из 225 ячеек, на которые можно положить те или
      иные буквы, чтобы из них собирать слова. В самом начале игры, каждый игрок
      получает случайные 7 карточек с буквами. Всего этих карточек 131 штука.
    </Typography>
    <Typography
      sx={{
        color: 'primary.contrastText',
        mb: 1
      }}
    >
      После составления слова игрок считает, сколько очков он набрал в
      зависимости от того, какие буквы он выбрал и на какие ячейки их поставил.
    </Typography>
    <Typography
      sx={{
        color: 'primary.contrastText'
      }}
    >
      В итоге побеждает тот, кто набрал больше всего очков к моменту, когда игроки
      больше не смогут составить новых слов в силу отсутствия места на поле или
      нехватки карточек с буквами
    </Typography>
    </>
  );
}

const StepStart = () => {
  return (
    <>
      <Typography
        sx={{
          color: 'primary.contrastText',
          mb:1
        }}
      >
        Первый игрок начинает ставить карточки, начиная с центральной клетки, и
        собирает слово. Направления для формирования слов могут быть только сверху
        вниз и слева направо.
      </Typography>
      <Typography
        sx={{
          color: 'primary.contrastText'
        }}
      >
        Следующему игроку позволено ставить слова на пересечении с уже
        имеющимися буквами. 
      </Typography>
    </>
  );
}

const StepCells = () => {
  return (
    <>
      <Typography
        sx={{
          color: 'primary.contrastText',
          mb: 1
        }}
      >
        Поле имеет различные виды ячеек. Каждый вид ячейки
        обозначается соответствующим цветом и предоставляет определенный бонус
        игроку, поставившему карточку на этот вид ячейки.
      </Typography>
      <Typography
        sx={{
          color: 'primary.contrastText',
          mb: 1
        }}
      >
        <span style={{color: '#1E5945', backgroundColor: 'white', padding: '5px'}}>Зелёная ячейка</span> не дает бонуса и очки за нее равны стоимости буквы.
      </Typography>
      <Typography
        sx={{
          color: 'primary.contrastText',
          mb: 1
        }}
      >
        <span 
          style={{color: '#42AAFF', backgroundColor: 'white', padding: '5px'}}
        >
          Голубая ячейка
        </span> умножает стоимость буквы в данной ячейке на 2.
      </Typography>
      <Typography
        sx={{
          color: 'primary.contrastText',
          mb: 1
        }}
      >
        <span 
          style={{color: 'blue', backgroundColor: 'white', padding: '5px'}}
        >
          Синяя ячейка
        </span> умножает стоимость буквы в данной ячейке на 3.
      </Typography>
      <Typography
        sx={{
          color: 'primary.contrastText',
          mb: 1
        }}
      >
        <span 
          style={{color: '#EB5284', backgroundColor: 'white', padding: '5px'}}
        >
          Розовая ячейка
        </span> умножает стоимость слова, составленного через эту ячейку, на 2.
      </Typography>
      <Typography
        sx={{
          color: 'primary.contrastText',
          mb: 1
        }}
      >
        <span 
          style={{color: 'red', backgroundColor: 'white', padding: '5px'}}
        >
          Красная ячейка
        </span> умножает стоимость слова, составленного через эту ячейку, на 3.
      </Typography>
    </>
  );
}

const StepWords = () => {
  return (
    <>
      <Typography
        sx={{
          color: 'primary.contrastText',
          mb: 1
        }}
      >
        В игре разрешено использовать любые слова, соответствующие
        стандартному русскому словарю. Но нельзя использовать сокращения, 
        слова через дефис и слова с заглавной буквы.
      </Typography>
      <Typography
        sx={{
          color: 'primary.contrastText',
          mb: 1
        }}
      >
        Некоторые слова не существуют в единственном числе или именительном
        падеже, такие слова можно использовать в том виде, который существует.
      </Typography>
    </>
  );
}

const RulesSteps = (props: Props) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderSteps = () => {
    switch(activeStep) {
      case 0: 
        return <StepMain/>
      case 1:
        return <StepStart/>
      case 2:
        return <StepCells/>
      case 3:
        return <StepWords/>
    }
  }

  return (
    <Box sx={{ 
      width: '100%',
      backgroundColor: 'secondary.main'
      }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel 
              >
                <Button
                  onClick={() => {setActiveStep(index)}}
                  sx={{
                    color: 'primary.contrastText'
                  }}
                >
                  {label}
                </Button>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 5, mb: 5, textAlign: 'center', color: 'primary.contrastText'}}>
            Теперь вы знаете как играть в Скрэббл.
          </Typography>
        </>
      ) : (
        <React.Fragment>  
          <Box
            sx={{
              p: 2
            }}
          >
            {renderSteps()}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ 
                mr: 1,
                ml: 1,
                mb: 1,
                color: 'primary.contrastText'
              }}
            >
              Назад
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}
              sx={{
                color: 'primary.contrastText',
                mb: 1,
                mr: 1
              }}
            >
              {activeStep === steps.length - 1 ? 'Понятно' : 'Далее'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default RulesSteps